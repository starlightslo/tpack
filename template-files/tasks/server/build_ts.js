/*jshint esversion: 6 */

const gulp = require('gulp');
const ts = require('gulp-typescript');
const Cache = require('gulp-file-cache');
const cache = new Cache();

const path = require('../const').path;
const tasks = require('../const').tasks;

gulp.task(tasks.SERVER_TS_DIST, function() {
	const tsProject = ts.createProject('tsconfig.json');
	return gulp.src([path.SERVER_TS])
		.pipe(cache.filter())
		.pipe(ts(tsProject)).js
		.pipe(cache.cache())
		.pipe(gulp.dest(path.SERVER_DIST));
});