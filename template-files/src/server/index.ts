/// <reference path="../../typings/tsd.d.ts" />
'use strict';

const Config = require('./config/config');
import { Utils } from './app/modules/utils';
import { Server } from './server';

// Create folders
let promiseList = [];
promiseList.push(Utils.ensureExists('logs', '0744'));
//promiseList.push(Utils.ensureExists(Config.path.public, '0777'));
Promise.all(promiseList)
.then(() => {
	const server = new Server(Config);

	// Start the server
	server.start()
	.then(() => {
		console.log(Config.appName + ' is running on port: ' + Config.port);
	})
	.catch(err => {
		console.error('Start server failed: ' + err);
	});
})
.catch(err => {
	console.error('Create folder error', err);
});
