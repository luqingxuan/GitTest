var path = require('path');

var gulp = require("gulp");

var browserSync = require('browser-sync');

var concat = require('gulp-concat');

var uglify = require('gulp-uglify');

var md5 = require("gulp-md5-plus");

var htmlmin = require('gulp-htmlmin');

var includeTag = require('gulp-include-tag');

var gulpSequence = require('gulp-sequence');

var webpack = require("webpack");

var WebpackDevServer = require('webpack-dev-server');

var webpackConfig = require("./webpack.config.js");

// 负责监听HTML变化,并刷新浏览器
var browserSyncStartPlugin = function() {

	this.plugin("done", function() {

		gulp.start("browser-sync");

	});

};

var domain = "localhost";

// 监听端口
var port = 8080;

// 后台调试API转发配置
var proxy = {
	'/v1/*' : {
		target : 'http://localhost:3000/',
		secure : false
	}
};

// 低版本IE8补丁
gulp.task('oldie', function() {

	return gulp.src(
			[ './src/js/lib/json2.js', './src/js/lib/es5-shim.js',
					'./src/js/lib/es5-sham.js', './src/js/lib/html5shiv.js',
					'./src/js/lib/respond.js' ]).pipe(concat('oldie.js')).pipe(
			uglify()).pipe(gulp.dest('./assets/js'));

});

// 清理目录
gulp.task('clean', function() {

	return require('del')([ './assets/*' ]);

});

// HTML页面include处理
gulp.task('html-include', function() {

	return gulp.src('./src/html/pages/**/*.html').pipe(includeTag()).pipe(
			gulp.dest('./assets'));

});

// HTML文件整理
gulp.task('html-minify', function() {

	return gulp.src('./assets/**/*.html').pipe(htmlmin({
		collapseWhitespace : true,
		removeComments : true
	})).pipe(gulp.dest('./assets'));

});

// MD5文件后缀命名
gulp.task('md5', function() {

	return gulp.src([ "./assets/**/*.css", "./assets/**/*.js" ]).pipe(
			md5(8, './assets/**/*.html')).pipe(gulp.dest("./assets"));

});

// 开发
gulp.task("webpack-dev", function(callback) {

	var config = Object.create(webpackConfig);

	config.devtool = 'eval';

	config.debug = true;

	delete config.devServer;

	// hot module replacement
	config.plugins = config.plugins
			.concat(new webpack.HotModuleReplacementPlugin());

	// 启动browser-sync
	config.plugins.push(browserSyncStartPlugin);

	for ( var key in config.entry) {

		if (!config.entry.hasOwnProperty(key))
			continue;

		if (!(config.entry[key] instanceof Array))
			config.entry[key] = [ config.entry[key] ];

		config.entry[key].unshift('webpack/hot/dev-server');
		config.entry[key].unshift(require.resolve("webpack-dev-server/client/")
				+ "?" + "http://" + domain + ":" + port);

	}

	var compiler = webpack(config);

	var server = new WebpackDevServer(compiler, {
		inline : true,
		hot : true,
		historyApiFallback : false,
		contentBase : path.resolve(__dirname, './assets'),
		publicPath : config.output.publicPath,
		// Set this if you want to enable gzip compression for assets
		compress : true,
		// webpack-dev-middleware options
		// quiet: false,
		// noInfo: false,
		lazy : false,
		stats : {
			colors : true
		},
		headers : {
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,OPTIONS',
			'Access-Control-Allow-Headers' : 'Content-Type'
		},
		proxy : proxy
	});

	server.listen(port, domain, function(err) {

		console.log('start at ' + domain + ':' + port);

	});

	return server;

});

// 正式打包
gulp.task("webpack-build", function(callback) {

	var config = Object.create(webpackConfig);

	config.devtool = 'eval';

	config.debug = false;

	delete config.devServer;

	config.plugins = config.plugins.concat(new webpack.DefinePlugin({
		"process.env" : {
			// This has effect on the react lib size
			"NODE_ENV" : JSON.stringify("production")
		}
	}), new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				mangle : {
					except : [ '$super', '$', 'exports', 'require' ]
				// 排除关键字
				},
				comments : false,
				compress : {
					warnings : false
				}
			}));

	return webpack(config, function() {

		callback();

	});

});

// 正式环境下，需要对文件进行压缩混淆，
// 但是这个压缩混淆后的代码，开发人员有可能代码质量有问题
// 压缩后代码失效，所以此处开一个测试环境，让开发人员开发完成后，切换环境跑一下
gulp.task("webpack-test", function(callback) {

	var config = Object.create(webpackConfig);

	config.devtool = 'eval';

	config.debug = true;

	delete config.devServer;

	config.plugins = config.plugins.concat(new webpack.DefinePlugin({
		"process.env" : {
			// This has effect on the react lib size
			"NODE_ENV" : JSON.stringify("production")
		}
	}), new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				mangle : {
					except : [ '$super', '$', 'exports', 'require' ]
				// 排除关键字
				},
				comments : false,
				compress : {
					warnings : false
				}
			}));

	// hot module replacement
	config.plugins = config.plugins
			.concat(new webpack.HotModuleReplacementPlugin());

	// 启动browser-sync
	config.plugins.push(browserSyncStartPlugin);

	for ( var key in config.entry) {

		if (!config.entry.hasOwnProperty(key))
			continue;

		if (!(config.entry[key] instanceof Array))
			config.entry[key] = [ config.entry[key] ];

		config.entry[key].unshift('webpack/hot/dev-server');
		config.entry[key].unshift(require.resolve("webpack-dev-server/client/")
				+ "?" + "http://" + domain + ":" + port);

	}

	var compiler = webpack(config);

	var server = new WebpackDevServer(compiler, {
		inline : true,
		hot : true,
		historyApiFallback : false,
		contentBase : path.resolve(__dirname, './assets'),
		publicPath : config.output.publicPath,
		// Set this if you want to enable gzip compression for assets
		compress : true,
		// webpack-dev-middleware options
		// quiet: false,
		// noInfo: false,
		lazy : false,
		stats : {
			colors : true
		},
		headers : {
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,OPTIONS',
			'Access-Control-Allow-Headers' : 'Content-Type'
		},
		proxy : proxy
	});

	server.listen(port, domain, function(err) {

		console.log('start at ' + domain + ':' + port);

	});

	return server;

});

// 正式发布文件
gulp.task("build", function(callback) {

	gulpSequence('clean', 'oldie', 'html-include', 'webpack-build', 'md5',
			'html-minify', callback);

});

// 开发调试环境
gulp.task("dev", function(callback) {

	gulpSequence('clean', 'oldie', 'html-include', 'webpack-dev', callback);

	// 监听HTML文件变化
	gulp.watch([ './src/**/*.html', './src/**/*.tpl' ], [ 'html-include' ]);

});

// 开发测试环境
gulp.task("test", function(callback) {

	gulpSequence('clean', 'oldie', 'html-include', 'webpack-test', callback);

	// 监听HTML文件变化
	gulp.watch([ './src/**/*.html', './src/**/*.tpl' ], [ 'html-include' ]);

});

// 监听HTML页面变化
gulp.task("browser-sync", function(callback) {

	browserSync({
		proxy : domain + ':' + port,
		port : 8888,
		files : [ 'assets/**/*.html' ],
		open : true,
		notify : true,
		reloadDelay : 500,// 延迟刷新
	});

});

gulp.task("default", [ 'dev' ]);
