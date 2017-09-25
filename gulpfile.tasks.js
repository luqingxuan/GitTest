const path = require('path');

const extend = require('extend');

const gulp = require('gulp');

const concat = require('gulp-concat');

const uglify = require('gulp-uglify');

const md5 = require('gulp-md5-plus');

const htmlmin = require('gulp-htmlmin');

const includeTag = require('gulp-include-tag');

const gulpSequence = require('gulp-sequence');

// 清理目录
gulp.task('clean', function() {
    return require('del')(['./dist/*']);
});

// 低版本IE8补丁
gulp.task('shim', function() {
    var src = ['./src/js/shim/console-polyfill.js'];
    src.push('./src/js/shim/json2.js');
    src.push('./src/js/shim/es5-shim.js', './src/js/shim/es5-sham.js');
    src.push('./src/js/shim/html5shiv.js', './src/js/shim/respond.js');

    return gulp.src(src).pipe(concat('shim.js')).pipe(uglify()).pipe(
        gulp.dest('./dist/assets/js'));
});

// MD5：Css文件中Font引用
gulp.task('md5-css-fonts', function() {
    var src = ['./dist/assets/fonts/**/*.*'];

    return gulp.src(src).pipe(md5(8, './dist/assets/css/**/*.css')).pipe(
        gulp.dest('./dist/assets/fonts'));
});

// MD5：Css文件中Image引用
gulp.task('md5-css-images', function() {
    var src = ['./dist/assets/images/**/*.*'];

    return gulp.src(src).pipe(md5(8, './dist/assets/css/**/*.css')).pipe(
        gulp.dest('./dist/assets/images'));
});

// HTML页面Include拼接处理
gulp.task('html-include', function() {
    return gulp.src('./src/html/pages/**/*.html').pipe(includeTag()).pipe(
        gulp.dest('./dist'));
});

// HTML文件压缩整理
gulp.task('html-minify', function() {
    return gulp.src('./dist/**/*.html').pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    })).pipe(gulp.dest('./dist'));
});

// Copy ext/images纯静态资源
gulp.task('html-ext-images', function() {
    var src = ['./src/ext/images/**/*.*'];
    return gulp.src(src).pipe(gulp.dest('./dist/assets/ext/images'));
});

// MD5：HTML文件中Image引用
gulp.task('md5-html-ext-images', ['html-ext-images'], function() {
    var src = ['./dist/assets/ext/images/**/*.*'];

    return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
        gulp.dest('./dist/assets/ext/images'));
});

// MD5：HTML文件中Css引用
gulp.task('md5-html-css', function() {
    var src = ['./dist/assets/css/**/*.css'];

    return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
        gulp.dest('./dist/assets/css'));
});

// MD5：HTML文件中Js引用
gulp.task('md5-html-js', function() {
    var src = ['./dist/assets/js/**/*.js'];

    return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
        gulp.dest('./dist/assets/js'));
});

// HTML文件生成
gulp.task('html', function(callback) {
    return gulpSequence('clean', 'shim', 'html-include', 'html-ext-images', callback);
});

// MD5文件后缀命名
gulp.task('md5', function(callback) {
    return gulpSequence('md5-html-css',
        'md5-html-js', 'md5-html-ext-images', 'md5-html-css', 'md5-html-js',
        'html-minify', callback);
});
