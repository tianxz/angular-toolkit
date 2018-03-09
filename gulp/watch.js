var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', [], function () {

    gulp.watch(path.join(conf.paths.demo, '/**/*.html'), function (event) {
        browserSync.reload(event.path);
    });

    gulp.watch([
        path.join(conf.paths.src, '/**/*.css'),
        path.join(conf.paths.src, '/**/*.js'),
        path.join(conf.paths.src, '/**/*.html')
    ], function (event) {
        if ( isOnlyChange(event) ) {
            gulp.start('build-at');
        }
    });
});