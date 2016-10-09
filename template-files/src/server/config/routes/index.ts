/// <reference path="../../../../typings/tsd.d.ts" />

// Router module
import { Router } from '../../app/modules/router';

exports.register = (server, options, next) => {
	/**
	 * Index controller
	 **/
	const IndexController = require('../../app/controllers/index');
	server.route((new Router('GET', '/', IndexController.index)).get());
	server.route((new Router('GET', '/ping', IndexController.ping)).get());

	// Handle static files
	server.route((new Router('GET', '/css/{filename*}', IndexController.cssFile)).get());
	server.route((new Router('GET', '/js/{filename*}', IndexController.jsFile)).get());
	server.route((new Router('GET', '/fonts/{filename*}', IndexController.fontFile)).get());
	server.route((new Router('GET', '/images/{filename*}', IndexController.imageFile)).get());
	server.route((new Router('GET', '/views/{filename*}', IndexController.htmlFile)).get());

	next();
};

exports.register.attributes = {
	name: 'Index Route',
	version: '1.0.0'
};
