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

// 域名
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
gulp.task('shim', function() {
	var src = [ './src/js/shim/console-polyfill.js' ];
	src.push('./src/js/shim/json2.js');
	src.push('./src/js/shim/es5-shim.js', './src/js/shim/es5-sham.js');
	src.push('./src/js/shim/html5shiv.js', './src/js/shim/respond.js');

	return gulp.src(src).pipe(concat('shim.js')).pipe(uglify()).pipe(
			gulp.dest('./dist/assets/js'));
});

// 清理目录
gulp.task('clean', function() {
	return require('del')([ './dist/*' ]);
});

// HTML页面include处理
gulp.task('html-include', function() {
	return gulp.src('./src/html/pages/**/*.html').pipe(includeTag()).pipe(
			gulp.dest('./dist'));
});

// HTML文件整理
gulp.task('html-minify', function() {
	return gulp.src('./dist/**/*.html').pipe(htmlmin({
		collapseWhitespace : true,
		removeComments : true
	})).pipe(gulp.dest('./dist'));
});

// MD5文件后缀命名
gulp.task('md5-font', function() {
	var src = [ "./dist/assets/font/**/*.*" ];

	return gulp.src(src).pipe(md5(8, './dist/assets/css/**/*.css')).pipe(
			gulp.dest("./dist/assets/font"));
});

// MD5文件后缀命名
gulp.task('md5-images', function() {
	var src = [ "./dist/assets/images/**/*.*" ];

	return gulp.src(src).pipe(md5(8, './dist/assets/css/**/*.css')).pipe(
			gulp.dest("./dist/assets/images"));
});

// MD5文件后缀命名
gulp.task('html-images', function() {
	var src = [ "./src/images/**/*.*" ];

	return gulp.src(src).pipe(gulp.dest("./dist/assets/images"));
});
gulp.task('md5-html-images', [ 'html-images' ], function() {
	var src = [ "./dist/assets/images/**/*.*" ];

	return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
			gulp.dest("./dist/assets/images"));
});

// MD5文件后缀命名
gulp.task('md5-css', function() {
	var src = [ "./dist/assets/css/**/*.css" ];

	return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
			gulp.dest("./dist/assets/css"));
});

// MD5文件后缀命名
gulp.task('md5-js', function() {
	var src = [ "./dist/assets/js/**/*.js" ];

	return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
			gulp.dest("./dist/assets/js"));
});

// MD5文件后缀命名
gulp.task('md5', function(callback) {
	return gulpSequence('md5-images', 'md5-html-images', 'md5-font', 'md5-css',
			'md5-js', callback);
});

// 正式打包压缩文件
gulp.task("webpack-build", function(callback) {
	var config = Object.create(webpackConfig);

	config.devtool = 'source-map';
	config.debug = false;
	delete config.devServer;

	config.plugins.push(new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.DefinePlugin({
				"process.env" : {
					"NODE_ENV" : JSON.stringify("production")
				}
			}));

	// uglify js file
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		mangle : {
			except : [ '$super', '$', 'exports', 'require' ]
		// 排除关键字
		},
		comments : false,
		compress : {
			// screw_ie8: true,//IE8
			warnings : false
		}
	}));

	return webpack(config, function(err, stat) {
		callback();
	});
});

// 正式打包源码文件
gulp.task("webpack-build-source", function(callback) {
	var config = Object.create(webpackConfig);

	config.devtool = 'source-map';
	config.debug = false;
	delete config.devServer;

	config.plugins.push(new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.DefinePlugin({
				"process.env" : {
					"NODE_ENV" : JSON.stringify("production")
				}
			}));

	return webpack(config, function(err, stat) {
		callback();
	});
});

// 开发调试源码环境
gulp.task("webpack-dev", function(callback) {
	var config = Object.create(webpackConfig);

	config.devtool = 'source-map';
	config.debug = true;
	delete config.devServer;

	config.plugins.push(new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.DefinePlugin({
				"process.env" : {
					"NODE_ENV" : JSON.stringify("production")
				}
			}));

	// hot module replacement
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

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
		contentBase : path.resolve(__dirname, './dist'),
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

// 正式环境下，需要对文件进行压缩混淆，
// 但是这个压缩混淆后的代码，开发人员有可能代码质量有问题
// 压缩后代码失效，所以此处开一个测试环境，让开发人员开发完成后，切换环境跑一下
gulp.task("webpack-dev-minify", function(callback) {
	var config = Object.create(webpackConfig);

	config.devtool = 'source-map';
	config.debug = true;
	delete config.devServer;

	config.plugins.push(new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.DefinePlugin({
				"process.env" : {
					"NODE_ENV" : JSON.stringify("production")
				}
			}));

	// uglify js file
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		mangle : {
			except : [ '$super', '$', 'exports', 'require' ]
		// 排除关键字
		},
		comments : false,
		compress : {
			// screw_ie8: true,//IE8
			warnings : false
		}
	}));

	// hot module replacement
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

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
		contentBase : path.resolve(__dirname, './dist'),
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

// 正式打包压缩文件
gulp.task("build", function(callback) {
	gulpSequence('clean', 'shim', 'html-include', 'webpack-build', 'md5',
			'html-minify', callback);
});

// 正式打包源码文件
gulp.task("build-source", function(callback) {
	gulpSequence('clean', 'shim', 'html-include', 'webpack-build-source',
			'md5', callback);
});

// 开发源码调试环境
gulp.task("dev", function(callback) {
	gulpSequence('clean', 'shim', 'html-images', 'html-include', 'webpack-dev',
			callback);

	// 监听HTML文件变化
	gulp.watch([ './src/**/*.html', './src/**/*.tpl' ], [ 'html-include' ]);
	gulp.watch([ './src/images/**/*.*' ], [ 'html-images' ]);
});

// 开发压缩调试环境
gulp.task("dev-minify", function(callback) {
	gulpSequence('clean', 'shim', 'html-images', 'html-include',
			'webpack-dev-minify', callback);

	// 监听HTML文件变化
	gulp.watch([ './src/**/*.html', './src/**/*.tpl' ], [ 'html-include' ]);
	gulp.watch([ './src/images/**/*.*' ], [ 'html-images' ]);
});

// 监听HTML页面变化
gulp.task("browser-sync", function(callback) {
	browserSync({
		proxy : domain + ':' + port,
		port : 8888,
		files : [ 'dist/**/*.html' ],
		open : true,
		notify : true,
		reloadDelay : 500,// 延迟刷新
	});
});

gulp.task("default", [ 'dev' ]);