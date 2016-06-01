var path = require('path');

var gulp = require("gulp");

var concat = require('gulp-concat');

var uglify = require('gulp-uglify');

var md5 = require("gulp-md5-plus");

var htmlmin = require('gulp-htmlmin');

var includeTag = require('gulp-include-tag');

var runSequence = require('run-sequence');

var webpack = require("webpack");

var WebpackDevServer = require('webpack-dev-server');

var webpackConfig = require("./webpack.config.js");

// 低版本IE8补丁
gulp.task('oldie', function() {

	return gulp.src(
			[ './src/js/lib/es5-shim.js', './src/js/lib/es5-sham.js',
					'./src/js/lib/html5shiv.js', './src/js/lib/respond.js' ])
			.pipe(concat('oldie.js')).pipe(uglify()).pipe(
					gulp.dest('./assets/js'));

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

	var compiler = webpack(config);

	new WebpackDevServer(compiler, {
		stats : {
			colors : true
		},
		hot : true,
		historyApiFallback : false,
		contentBase : path.resolve(__dirname, './assets'),
		publicPath : config.output.publicPath,
		// quiet: false,
		// noInfo: false,
		inline : true,
		lazy : false,
		proxy : {
			'/v1/*' : {
				target : 'http://localhost:3000/',
				secure : false
			}
		}
	}).listen(8080, 'localhost', function(err) {

		console.log('start at localhost:8080');

	});

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
				compress : {
					warnings : false
				}
			}));

	var compiler = webpack(config);

	new WebpackDevServer(compiler, {
		stats : {
			colors : true
		},
		hot : true,
		historyApiFallback : false,
		contentBase : path.resolve(__dirname, './assets'),
		publicPath : config.output.publicPath,
		// quiet: false,
		// noInfo: false,
		inline : true,
		lazy : false,
		proxy : {
			'/v1/*' : {
				target : 'http://localhost:3000/',
				secure : false
			}
		}
	}).listen(8080, 'localhost', function(err) {

		console.log('start at localhost:8080');

	});

});

// 正式发布文件
gulp.task("build", function(callback) {

	runSequence('clean', 'oldie', 'html-include', 'webpack-build', 'md5',
			'html-minify', callback);

});

// 开发调试环境
gulp.task("dev", function(callback) {

	runSequence('clean', 'oldie', 'html-include', 'webpack-dev', function() {

		gulp.watch('./src/js/pages/**/*.js', 'default');

	});

});

// 开发测试环境
gulp.task("test", function(callback) {

	runSequence('clean', 'oldie', 'html-include', 'webpack-test', callback);

});

gulp.task("default", [ 'dev' ]);
