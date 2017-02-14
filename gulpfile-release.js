require('./gulpfile-tasks.js');

const extend = require('extend');

const gulp = require('gulp');

const gulpSequence = require('gulp-sequence');

const browserSync = require('browser-sync');

const webpack = require('webpack');

const WebpackDevServer = require('webpack-dev-server');

const webpackReleaseConfig = require('./webpack.release.config.js');

// to remote web server
const publishServerPath = './dist';

// 正式打包压缩文件
gulp.task('webpack-build', function(callback) {
    var webpackConfig = extend({}, webpackReleaseConfig);

    return webpack(webpackConfig, function(err, stat) {
        callback();
    });
});

// 正式打包源码文件
gulp.task('webpack-build-source', function(callback) {
    var webpackConfig = extend({}, webpackReleaseConfig);

    // 认定最后一个是压缩插件
    if (webpackConfig.plugins && webpackConfig.plugins.length)
        webpackConfig.plugins.pop();

    return webpack(webpackConfig, function(err, stat) {
        callback();
    });
});

// 正式打包压缩文件
gulp.task('build', function(callback) {
    gulpSequence('clean', 'shim', 'html-include', 'webpack-build', 'md5',
        'html-minify', callback);
});

// 正式打包源码文件
gulp.task('build-source', function(callback) {
    gulpSequence('clean', 'shim', 'html-include', 'webpack-build-source',
        'md5', callback);
});

// dist目录copy至发布目录
gulp.task('toremote', function(callback) {
    var src = './dist/**/*.*';

    return gulp.src(src).pipe(
        gulp.dest(publishServerPath));
});

// 发布压缩文件
gulp.task('publish', function(callback) {
    gulpSequence('build', 'toremote', callback);
});

// 发布未压缩文件
gulp.task('publish-source', function(callback) {
    gulpSequence('build-source', 'toremote', callback);
});
