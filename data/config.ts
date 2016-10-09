/// <reference path="../../../typings/tsd.d.ts" />

const extend = require('util')._extend;

const test = require('./env/test');
const dev = require('./env/dev');
const alpha = require('./env/alpha');
const beta = require('./env/beta');
const production = require('./env/production');

const DEV_ENV = 'dev';

const defaults = {
	name: '<%=appName%>',
	appName: '<%=appName%> - ' + process.env.NODE_ENV || DEV_ENV,
	saltLength: 10,
	root: require('path').join(__dirname, '..'),
	path: {
		public: require('path').join(__dirname, '../../client/public'),
		views: require('path').join(__dirname, '../../client/views'),
		routes: './config/routes',
		plugins: './app/plugins',
		strategy: './app/strategies'
	},
	env: process.env.NODE_ENV || DEV_ENV,
	chunkSize: 1000
};

module.exports = {
	test: extend(test, defaults),
	dev: extend(dev, defaults),
	alpha: extend(alpha, defaults),
	beta: extend(beta, defaults),
	production: extend(production, defaults)
}[process.env.NODE_ENV || DEV_ENV];
