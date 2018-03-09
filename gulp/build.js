var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var merger = require('merge-stream');
var del = require('del');

var $ = require('gulp-load-plugins')({
    pattern: [ 'gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'merge-stream' ]
});

gulp.task('build-css', function () {
    var css = gulp
        .src([ path.join(conf.paths.src, '/**/*.css') ])
        .pipe($.concat('angular-toolkit.css'))
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'at-css')));

    merger(css)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'css')))
});

gulp.task('build-at', [ 'build-css' ], function () {
    /**
     * 转换 template html 为 angular cache
     */
    var templates = gulp
        .src([ path.join(conf.paths.src, '/**/template/*.html') ])
        .pipe($.debug({ title: 'build-template' }))
        .pipe($.angularTemplatecache('at-template-cache.html.js', {
            standalone: true,
            templateHeader: 'angular.module(\'at/template/cache\'<%= standalone %>).run([\'$templateCache\', function($templateCache) {',
            templateBody: '$templateCache.put(\'at/<%= url %>\',\'<%= contents %>\');'
        }))
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'at-templates')));

    var toolkit = gulp
        .src([ path.join(conf.paths.src, '/*/*.js') ])
        .pipe($.debug({ title: 'build-toolkit' }))
        .pipe($.concat('angular-toolkit-tmp.js'))
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'at-scripts')));

    merger(templates, toolkit)
        .pipe($.concat('angular-toolkit.js'))
        .pipe(gulp.dest(path.join(conf.paths.dist)));
});

gulp.task('cleared', function () {
    return del([ 'dist' ])
});

gulp.task('build', [ 'build-at', 'copy-vendor' ]);

gulp.task('copy-vendor', function () {
    for ( var name in conf.vendors ) {
        var vendor = conf.vendors[ name ];
        gulp
            .src(vendor.src)
            .pipe(gulp.dest(path.join(conf.paths.demo, conf.paths.vendor, name)));
    }
});