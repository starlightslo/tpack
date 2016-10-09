/*jshint esversion: 6 */

require('require-dir')('client');
require('require-dir')('server');

const gulp = require('gulp');

const path = require('./const').path;
const tasks = require('./const').tasks;

gulp.task(tasks.WATCH, function() {
	gulp.watch(path.JS, [tasks.CLIENT_JS_DIST]);
	gulp.watch(path.CSS, [tasks.CLIENT_CSS_DIST]);
	gulp.watch(path.IMAGE, [tasks.CLIENT_IMAGE_DIST]);
	gulp.watch(path.FONT, [tasks.CLIENT_FONT_DIST]);
	gulp.watch(path.HTML, [tasks.CLIENT_VIEWS_DIST]);
	gulp.watch(path.TEMPLATE, [tasks.CLIENT_TEMPLATES_DIST]);
	gulp.watch(path.ALL_JS, [tasks.JSHINT]);
});

// Build Task
gulp.task(tasks.BUILD, [
	tasks.SERVER_TS_DIST,
	tasks.CLIENT_JS_DIST,
	tasks.CLIENT_CSS_DIST,
	tasks.CLIENT_IMAGE_DIST,
	tasks.CLIENT_FONT_DIST,
	tasks.CLIENT_VIEWS_DIST,
	tasks.CLIENT_TEMPLATES_DIST,
	tasks.JSHINT
]);

// Default Task
gulp.task('default', [
	tasks.SERVER,
	tasks.CLIENT_JS_DIST,
	tasks.CLIENT_CSS_DIST,
	tasks.CLIENT_IMAGE_DIST,
	tasks.CLIENT_FONT_DIST,
	tasks.CLIENT_VIEWS_DIST,
	tasks.CLIENT_TEMPLATES_DIST,
	tasks.JSHINT,
	tasks.WATCH
]);
