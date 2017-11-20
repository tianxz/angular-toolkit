'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

/**
 * 转换 template html 为 angular cache
 */
gulp.task('template', function () {
    gulp
        .src([
            path.join(conf.paths.src, 'dept/**/template/*.html')
        ])
        .pipe($.angularTemplatecache('dept-template-cache-html.js', {
            module: 'at/dept/template/cache',
            root: 'at',
            standalone: true
        }))
        .pipe(gulp.dest(conf.paths.tmp + '/template/'));
});