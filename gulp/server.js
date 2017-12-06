var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var server = {
        baseDir: baseDir
    };

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: server,
        browser: browser,
        ghostMode: false
    });
}

browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
    browserSyncInit([path.join(conf.paths.tmp, conf.paths.serve), conf.paths.demo]);
});