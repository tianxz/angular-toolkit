var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var util = require('util');
var fs = require('fs');
var merger = require('merge-stream');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'merge-stream']
});

gulp.task('copy', ['copy-vendor']);
gulp.task('build', ['copy', 'build-concat']);

/**
 * 转换 template html 为 angular cache
 */
gulp.task('build-toolkit', function () {
    var templates = gulp
        .src([path.join(conf.paths.src, '/**/template/*.html')])
        .pipe($.debug({title: 'build-template'}))
        .pipe($.angularTemplatecache('at-template-cache.html.js', {
            standalone: true,
            templateHeader: 'angular.module(\'at/template/cache\'<%= standalone %>).run([\'$templateCache\', function($templateCache) {',
            templateBody: '$templateCache.put(\'at/<%= url %>\',\'<%= contents %>\');'
        }))
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'at-templates')));

    var toolkit = gulp
        .src([path.join(conf.paths.src, '/*/*.js')])
        .pipe($.debug({title: 'build-toolkit'}))
        .pipe($.concat('angular-toolkit-tmp.js'))
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'at-scripts')));

    merger(templates, toolkit)
        .pipe($.concat('angular-toolkit.js'))
        .pipe(gulp.dest(path.join(conf.paths.demo, 'vendors/angular-toolkit')));
});

gulp.task('build', ['build-toolkit', 'copy-vendor'], function () {

});

gulp.task('copy-vendor', function () {
    for (var name in conf.vendors) {
        var vendor = conf.vendors[name];
        gulp
            .src(vendor.src)
            .pipe(gulp.dest(path.join(conf.paths.demo, conf.paths.vendor, name)));
    }
});