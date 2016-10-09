/// <reference path="../../../../typings/tsd.d.ts" />

import * as Boom from 'boom'

exports.index = function(request, reply) {
	const viewConfig = {
		title: request.server.config.appName,
		hello: 'Hello world'
	};
	reply.view('index', viewConfig);
};

exports.ping = function(request, reply) {
	request.server.r(200, 'pong', request, reply);
};

exports.cssFile = {
	directory: {
		path: './css',
		redirectToSlash: true,
		index: true
	}
};

exports.jsFile = {
	directory: {
		path: './js',
		redirectToSlash: true,
		index: true
	}
};

exports.imageFile = {
	directory: {
		path: './images',
		redirectToSlash: true,
		index: true
	}
};

exports.fontFile = {
	directory: {
		path: './fonts',
		redirectToSlash: true,
		index: true
	}
};

exports.htmlFile = {
	directory: {
		path: './views',
		redirectToSlash: true,
		index: true
	}
};
