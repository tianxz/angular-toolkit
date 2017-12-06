var gulpUtil = require('gulp-util');
var path = require('path');
var vendorPath = 'node_modules';

exports.version = {
    default: '1.0.0-dev'
};

/**
 *  项目主要路径配置
 */
exports.paths = {
    src: 'src',
    dist: 'release',
    tmp: '.tmp',
    serve: 'serve',
    demo: 'misc/demo',
    vendor: 'vendors'
};

/**
 * 第3方 js 库配置
 * 1. 用于 copy 到 serve 目录下
 * @type {{angular: {codeStyle: string, dir: string}, bootstrap: {codeStyle: string, dir: string, excludes: [string]}}}
 */
exports.vendors = {
    angular: {
        src: [
            path.join(vendorPath, 'angular', 'angular.js'),
            path.join(vendorPath, 'angular', 'angular.min.js')
        ]
    },
    bootstrap: {
        src: [
            path.join(vendorPath, 'bootstrap', 'dist/**'),
            '!' + path.join(vendorPath, 'bootstrap', 'dist/js/'),
            '!' + path.join(vendorPath, 'bootstrap', 'dist/js/**')
        ]
    },
    jquery: {
        src: [
            path.join(vendorPath, 'jquery', 'dist/jquery.js'),
            path.join(vendorPath, 'jquery', 'dist/jquery.min.js'),
        ]
    }
};

/**
 *  Gulp 插件错误处理
 */
exports.errorHandler = function (title) {
    'use strict';

    return function (err) {
        gulpUtil.log(gulpUtil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};