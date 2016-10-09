/*jshint esversion: 6 */

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const path = require('../const').path;
const tasks = require('../const').tasks;

gulp.task(tasks.SERVER, [tasks.SERVER_TS_DIST], () => {
	nodemon({
		script: path.INDEX,
		ext: 'ts',
		tasks: [tasks.SERVER_TS_DIST]
	})
	.on('restart', function () {
		console.log('restarted!');
	});
});
