/// <reference path="../../../../typings/tsd.d.ts" />

// Interfaces
import * as IServer from '../interfaces/IServerConfig';

/**
 * config reference:
 * http://hapijs.com/api#route-options
 **/

class Router {
	method: string | string[];
	path: string;
	handler: any;
	config: IServer.RouteConfig;

	constructor(method: string|string[], path: string, handler: any, config?: IServer.RouteConfig) {
		this.method = method;
		this.path = path;
		this.handler = handler;
		this.config = config;
	}

	get(): IServer.Route {
		let route = {
			method: this.method,
			path: this.path
		}
		if (this.handler) route['handler'] = this.handler;
		if (this.config) {
			route['config'] = this.config;
		} else {
			route['config'] = {
				auth: false
			}
		}
		return route;
	}
}

export {Router};