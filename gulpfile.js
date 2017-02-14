require('./gulpfile-tasks.js');
require('./gulpfile-release.js');

const extend = require('extend');

const gulp = require('gulp');

const gulpSequence = require('gulp-sequence');

const browserSync = require('browser-sync');

const webpack = require('webpack');

const WebpackDevServer = require('webpack-dev-server');

const webpackDevelopConfig = require('./webpack.config.js');

// 域名
const webServerDomain = 'localhost';

// 端口
const webServerPort = 7070;

// 代理端口
const webServerProxyPort = 7777;

const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    mangle: {
        except: ['$super', '$', 'exwebServerPorts', 'require']
            // 排除关键字
    },
    comments: false,
    compress: {
        // screw_ie8: true,//IE8
        warnings: false
    }
});

// 负责监听HTML变化,并刷新浏览器
const browserSyncPlugin = function() {
    this.plugin('done', function() {
        gulp.start('browser-sync');
    });
};

// 监听HTML页面变化
gulp.task('browser-sync', function(callback) {
    browserSync({
        proxy: webServerDomain + ':' + webServerPort,
        port: webServerProxyPort,
        files: ['dist/**/*.html'],
        open: true,
        notify: true,
        reloadDelay: 500, // 延迟刷新
    });
});

// 开发调试源码环境
gulp.task('webpack-dev', function(callback) {
    var webpackConfig = extend(true, {}, webpackDevelopConfig);

    // 启动browser-sync
    webpackConfig.plugins.push(browserSyncPlugin);

    var cfg = {
        inline: true,
        hot: true,
        historyApiFallback: false,
        contentBase: webpackConfig.devServer.contentBase,
        publicPath: webpackConfig.output.publicPath,
        // Set this if you want to enable gzip compression for assets
        compress: true,
        // webpack-dev-middleware options
        // quiet: false,
        // noInfo: false,
        lazy: false,
        stats: {
            colors: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        proxy: webpackConfig.devServer.proxy
    };

    var compiler = webpack(webpackConfig);

    var server = new WebpackDevServer(compiler, cfg);

    server.listen(webServerPort, webServerDomain, function(err) {
        console.log('start at ' + webServerDomain + ':' + webServerPort);
    });

    return server;
});

gulp.task('webpack-dev-minify', function(callback) {
    var webpackConfig = extend(true, {}, webpackDevelopConfig);

    var cfg = {
        inline: true,
        hot: true,
        historyApiFallback: false,
        contentBase: webpackConfig.devServer.contentBase,
        publicPath: webpackConfig.output.publicPath,
        // Set this if you want to enable gzip compression for assets
        compress: true,
        // webpack-dev-middleware options
        // quiet: false,
        // noInfo: false,
        lazy: false,
        stats: {
            colors: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        proxy: webpackConfig.devServer.proxy
    };

    // uglify js file
    webpackConfig.plugins.push(uglifyJsPlugin);

    // 启动browser-sync
    webpackConfig.plugins.push(browserSyncPlugin);

    var compiler = webpack(webpackConfig);

    var server = new WebpackDevServer(compiler, cfg);

    server.listen(webServerPort, webServerDomain, function(err) {
        console.log('start at ' + webServerDomain + ':' + webServerPort);
    });

    return server;
});

// 开发源码调试环境
gulp.task('dev', function(callback) {
    gulpSequence('clean', 'shim', 'html-images', 'html-include', 'webpack-dev',
        callback);

    // 监听HTML文件变化
    gulp.watch(['./src/**/*.html', './src/**/*.vue', './src/**/*.tpl'], ['html-include']);
    gulp.watch(['./src/images/**/*.*'], ['html-images']);
});

// 开发压缩调试环境
gulp.task('dev-minify', function(callback) {
    gulpSequence('clean', 'shim', 'html-images', 'html-include',
        'webpack-dev-minify', callback);

    // 监听HTML文件变化
    gulp.watch(['./src/**/*.html', './src/**/*.vue', './src/**/*.tpl'], ['html-include']);
    gulp.watch(['./src/images/**/*.*'], ['html-images']);
});

gulp.task('default', ['dev']);
