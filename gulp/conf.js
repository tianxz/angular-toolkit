var gulpUtil = require('gulp-util');
var path = require('path');

exports.version = {
    default: '1.0.0-dev'
};

/**
 *  项目主要路径配置
 */
exports.paths = {
    src: 'src',
    dist: 'dist',
    tmp: '.tmp',
    serve: 'serve',
    demo: 'misc/demo',
    vendor: 'vendors',
    nodeModules: 'node_modules'
};

/**
 * 第3方 js 库配置
 * 1. 用于 copy 到 serve 目录下
 * @type {{angular: {codeStyle: string, dir: string}, bootstrap: {codeStyle: string, dir: string, excludes: [string]}}}
 */
exports.vendors = {
    'angular': {
        src: [
            path.join(exports.paths.nodeModules, 'angular', 'angular.js'),
            path.join(exports.paths.nodeModules, 'angular', 'angular.min.js')
        ]
    },
    'bootstrap': {
        src: [
            path.join(exports.paths.nodeModules, 'bootstrap', 'dist/**'),
            '!' + path.join(exports.paths.nodeModules, 'bootstrap', 'dist/js/'),
            '!' + path.join(exports.paths.nodeModules, 'bootstrap', 'dist/js/**')
        ]
    },
    'jquery': {
        src: [
            path.join(exports.paths.nodeModules, 'jquery', 'dist/jquery.js'),
            path.join(exports.paths.nodeModules, 'jquery', 'dist/jquery.min.js'),
        ]
    },
    'angular-ui-bootstrap': {
        src: [
            path.join(exports.paths.nodeModules, 'angular-ui-bootstrap/dist/**'),
            '!' + path.join(exports.paths.nodeModules, 'angular-ui-bootstrap/dist/ui-bootstrap.js')
        ]
    },
    'angular-toolkit': {
        src: [
            path.join(exports.paths.dist, '/**')
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