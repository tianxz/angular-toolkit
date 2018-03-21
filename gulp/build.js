var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var merger = require('merge-stream');
var del = require('del');

var $ = require('gulp-load-plugins')({
    pattern: [ 'gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'merge-stream' ]
});

/**
 * 1. 拿到 conf.paths.src 目录下的所有css并合并成angular-toolkit.css并拷贝到 .tmp/at-css 目录
 * 2. 执行完上述任务后将合并后的css拷贝到 dist/css 目录下
 */
gulp.task('build-css', function () {
    var css = gulp
        .src([ path.join(conf.paths.src, '/**/*.css') ])
        .pipe($.concat('angular-toolkit.css'))
        .pipe(gulp.dest(path.join(conf.paths.tmp, 'at-css')));

    merger(css)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'css')))
});

/**
 * 1. 转换 template html 为 angular cache并拷贝到 .tmp/at-templates
 * 2. 拿到 conf.paths.src 目录下的所有js并合并成angular-toolkit-tmp.js并拷贝到 .tmp/at-scripts
 * 3. 从 .tmp 目录中拷贝 angular-toolkit-tmp.js和at-template-cache.html.js 到 dist目录
 */
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

/**
 * 删除dist文件夹及其子文件
 */
gulp.task('cleared', function () {
    return del([ 'dist' ])
});

/**
 * 执行 build-at和copy-vendor 任务
 */
gulp.task('build', [ 'build-at', 'copy-vendor' ]);

/**
 * 拷贝 node_modules/ 目录下的第三方js库到 misc/demo/vendors, 第三方库路径配置在 conf.js 中
 */
gulp.task('copy-vendor', function () {
    for ( var name in conf.vendors ) {
        var vendor = conf.vendors[ name ];
        gulp
            .src(vendor.src)
            .pipe(gulp.dest(path.join(conf.paths.demo, conf.paths.vendor, name)));
    }
});