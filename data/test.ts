/// <reference path="../../../../typings/tsd.d.ts" />

module.exports = {
	port: process.env.PORT || 7999,
	secret: '0123456789abcdefghijklmnopqustuvwxyz',		// Should more than 32 characters
	logConfig: {
		name: '<%=appName%>',
		env: 'Testing',
		level: 'debug'
	}
};