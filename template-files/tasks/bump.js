/*jshint esversion: 6 */

const argv = require('yargs').argv;

const gulp = require('gulp');
const bump = require('gulp-bump');

const path = require('./const').path;
const tasks = require('./const').tasks;

/*
 * How to use it:
 *    For patch release: gulp release
 *        1.0.0 > 1.0.1
 *    For minor release: gulp release --minor
 *        1.0.0 > 1.1.0
 *    For major release: gulp release --major
 *        1.0.0 > 2.0.0
 */
gulp.task(tasks.BUMP, () => {
    if (argv.minor) {
        gulp.src(path.PACKAGE_JSON)
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
    } else if (argv.major) {
        gulp.src(path.PACKAGE_JSON)
        .pipe(bump({type:'major'}))
        .pipe(gulp.dest('./'));
    } else {
        gulp.src(path.PACKAGE_JSON)
        .pipe(bump())
        .pipe(gulp.dest('./'));
    }
});
