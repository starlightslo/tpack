/// <reference path="../../typings/tsd.d.ts" />

const Hapi = require('hapi');
const Bunyan = require('bunyan');
const Inert = require('inert');

// Interfaces
import * as IServer from './app/interfaces/IServerConfig';

// Handler
import { ResponseHandler } from './config/handler/ResponseHandler'

class Server {
	server = undefined;
	config: IServer.Config;

	constructor(config: IServer.Config) {
		this.config = config;

		// Hapi Server Config
		let HapiConfig = {
			connections: {
				routes: {
					files: {
						relativeTo: this.config.path.public
					}
				}
			}
		};

		// Adding cache feature
		if (this.config.cache) {
			HapiConfig['cache'] = this.config.cache;
		}

		// Create Hapi server
		this.server = new Hapi.Server(HapiConfig);
		this.server.connection({
			port: this.config.port
		});

		// Set config into hapi server
		this.server.config = this.config;

		// Set view engines
		this.server.register(require('vision'), (err) => {
			this.server.views({
				engines: {
					ejs: require('ejs')
				},
				relativeTo: __dirname,
				path: '../client/templates',
				layoutPath: '../client/templates/layout',
				helpersPath: '../client/templates/helpers'
			});
		});

		// Serving static file
		this.server.register(Inert, () => { });

		// Setting session
		if (this.config.session) {
			this.setSession(this.config.session);
		}
	}

	self(): Function {
		return this.server;
	}

	loadStrategies(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const fs = require('fs');
			const path = require('path');
			fs.stat(path.join(this.config.root, this.config.path.strategy), (err, stats) => {
				if (!err) {
					fs.readdirSync(path.join(this.config.root, this.config.path.strategy)).forEach(file => {
						if (file.endsWith('.js')) {
							const strategy = require(this.config.path.strategy + '/' + file);
							console.log('Loading ' + strategy.name + ' strategy...');
							try {
								stats = fs.statSync(path.join(this.config.root, this.config.path.strategy, strategy.plugin));
								if (stats) {
									try {
										const plugin = require(this.config.path.strategy + '/' + strategy.plugin + '/' + strategy.plugin + '.js');
										this.addStrategy(plugin, strategy.isDefault, strategy.name, strategy.scheme, strategy.mode, strategy.options);
									} catch (e) {
										console.error('Load ' + strategy.name + ' failed: ', e);
									}
								}
							} catch (e) {
								const plugin = require(strategy.plugin);
								this.addStrategy(plugin, strategy.isDefault, strategy.name, strategy.scheme, strategy.mode, strategy.options);
							}
						}
					});
				}
				resolve();
			});
		});
	}

	loadRoutes(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const fs = require('fs');
			const path = require('path');
			fs.stat(path.join(this.config.root, this.config.path.routes), (err, stats) => {
				if (!err) {
					fs.readdirSync(path.join(this.config.root, this.config.path.routes)).forEach(file => {
						if (file.endsWith('.js')) {
							console.log('Loading ' + file + ' route...');
							this.addPlugin(require(this.config.path.routes + '/' + file), {});
						}
					});
				}
				resolve();
			});
		});
	}

	loadPlugins(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const fs = require('fs');
			const path = require('path');
			fs.stat(path.join(this.config.root, this.config.path.plugins), (err, stats) => {
				if (!err) {
					fs.readdirSync(path.join(this.config.root, this.config.path.plugins)).forEach(file => {
						if (file.endsWith('.js')) {
							const pluginName = require(this.config.path.plugins + '/' + file).name;
							const pluginOptions = require(this.config.path.plugins + '/' + file).options;
							try {
								stats = fs.statSync(path.join(this.config.root, this.config.path.plugins, pluginName));
								if (stats) {
									try {
										this.addPlugin(require(this.config.path.plugins + '/' + pluginName + '/' + pluginName + '.js'), pluginOptions);
									} catch (e) {
										console.error('Load ' + pluginName + ' failed: ', e);
									}
								}
							} catch (e) {
								this.addPlugin(require(pluginName), pluginOptions);
							}
						}
					});
				}
				resolve();
			});
		});
	}

	setLogger(): void {
		this.server.register({
			register: require('hapi-bunyan'),
			options: {
				logger: Bunyan.createLogger(this.config.logConfig)
			}
		}, (err) => {

		});
	}

	addStrategy(plugin: any, isDefault: boolean, name: string, scheme: string, mode: boolean, options: Object): void {
		this.server.register(plugin, (err) => {
			if (err) {
				console.error('Failed to load plugin:', err);
			} else {
				this.server.auth.strategy(name, scheme, mode, options);
			}
		});

		if (isDefault) {
			this.server.auth.default({
				strategy: name
			});
		}
	}

	addRoute(route: IServer.Route): void {
		this.server.route(route);
	}

	addPlugin(plugin: any, options: Object): void {
		this.server.register({
			register: plugin,
			options: options
		}, (err) => {
			if (err) {
				console.error('Failed to load plugin:', err);
			}
		});
	}

	setSession(session: IServer.Session): void {
		this.server.state('session', session);
	}

	initDB() {
		return new Promise((resolve, reject) => {
			if (this.config.db) {
				this.server.db = require('knex')(this.config.db);
			}
			if (this.config.ssoDB) {
				this.server.ssoDB = require('knex')(this.config.ssoDB);
			}
			if (this.config.pushDB) {
				this.server.pushDB = require('knex')(this.config.pushDB);
			}

			if (this.config.sessionDB) {
				if (this.config.sessionDB.client === Database.Hazelcast) {
					this.initHazelcastDB(this.config.sessionDB.connection)
					.then((hazelcastClient) => {
						this.server.sessionDB = hazelcastClient;
						resolve();
					})
					.catch((err) => {
						reject(err);
					});
				} else {
					resolve();
				}
			} else {
				resolve();
			}
		});
	}

	initHazelcastDB(connection) {
		return new Promise((resolve, reject) => {
			const HazelcastClient = require('hazelcast-client').Client;
			const HazelcastConfig = new (require('hazelcast-client').Config.ClientConfig)();
			HazelcastConfig.networkConfig.addresses = [{host: connection.host, port: connection.port}];
			HazelcastClient.newHazelcastClient(HazelcastConfig)
			.then((hazelcastClient) => {
				resolve(hazelcastClient);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	setHandler() {
		this.server.r = ResponseHandler;
	}

	start(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			// Loading strategies
			this.loadStrategies()
			.then(() => {
				// Loading plugins
				return this.loadPlugins();
			})
			.then(() => {
				// Loading routes
				return this.loadRoutes();
			})
			.then(() => {
				// Setup Database
				return this.initDB();
			})
			.then(() => {
				// Setup logger
				this.setLogger();

				// Setup handler
				this.setHandler();

				// Start server
				this.server.start((err) => {
					if (err) {
						reject(err);
					}
					resolve();
				});
			})
			.catch((err) => {
				reject(err)
			});
		});
	}
}

class Database {
	static Hazelcast = 'hazelcast';
}

export {Server};