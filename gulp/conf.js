"use strict";

var gutil = require('gulp-util');

/**
 *  项目主要路径配置
 */
exports.paths = {
    src: 'src',
    dist: 'release',
    devDist: 'release-dev',
    tmp: '.tmp'
};

/**
 *  Gulp 插件错误处理
 */
exports.errorHandler = function (title) {
    'use strict';

    return function (err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};