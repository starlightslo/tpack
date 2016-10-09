/*jshint esversion: 6 */

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev-append');

const path = require('../const').path;
const tasks = require('../const').tasks;

gulp.task(tasks.CLIENT_TEMPLATES_DIST, () => {
	return gulp.src(path.TEMPLATE)
		.pipe(rev())
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(path.CLIENT_DIST));
});