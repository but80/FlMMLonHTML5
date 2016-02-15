'use strict';

var gulp = require('gulp');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat-sourcemap');
var addsrc = require('gulp-add-src');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('dts', function(done){
	gulp.src([ './project/**/*.ts' ])
		.pipe(typescript({ target:'ES5', declaration:true, removeComments:false }))
		.dts
		.pipe(addsrc('./project/**/*.d.ts'))
		.pipe(gulp.dest('./dist/dts/'))
		.on('end', done);
});

gulp.task('build', function(done){
	gulp.src([
		'./project/lib/*.ts',
		'./project/fmgenAs/*.ts',
		'./project/messenger/*.ts',
		'./project/flmml/*.ts'
	])
		.pipe(sourcemaps.init())
		.pipe(typescript({ target:'ES5', removeComments:true }))
		.js
		.pipe(concat('flmmlworker.js'))
		.pipe(browserify({
			insertGlobals: true,
			debug: false
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'))
		.on('end', done);
});

gulp.task('default', [ 'build', 'dts' ]);
