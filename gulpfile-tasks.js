const path = require('path');

const extend = require('extend');

const gulp = require('gulp');

const concat = require('gulp-concat');

const uglify = require('gulp-uglify');

const md5 = require('gulp-md5-plus');

const htmlmin = require('gulp-htmlmin');

const includeTag = require('gulp-include-tag');

const gulpSequence = require('gulp-sequence');

// 低版本IE8补丁
gulp.task('shim', function() {
    var src = ['./src/js/shim/console-polyfill.js'];
    src.push('./src/js/shim/json2.js');
    src.push('./src/js/shim/es5-shim.js', './src/js/shim/es5-sham.js');
    src.push('./src/js/shim/html5shiv.js', './src/js/shim/respond.js');

    return gulp.src(src).pipe(concat('shim.js')).pipe(uglify()).pipe(
        gulp.dest('./dist/assets/js'));
});

// 清理目录
gulp.task('clean', function() {
    return require('del')(['./dist/*']);
});

// HTML页面include处理
gulp.task('html-include', function() {
    return gulp.src('./src/html/pages/**/*.html').pipe(includeTag()).pipe(
        gulp.dest('./dist'));
});

// HTML文件整理
gulp.task('html-minify', function() {
    return gulp.src('./dist/**/*.html').pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    })).pipe(gulp.dest('./dist'));
});

// MD5文件后缀命名
gulp.task('md5-font', function() {
    var src = ['./dist/assets/font/**/*.*'];

    return gulp.src(src).pipe(md5(8, './dist/assets/css/**/*.css')).pipe(
        gulp.dest('./dist/assets/font'));
});

// src目录下copy到dist目录下
gulp.task('html-images', function() {
    var src = ['./src/images/**/*.*'];

    return gulp.src(src).pipe(gulp.dest('./dist/assets/images'));
});

// MD5文件后缀命名
gulp.task('md5-images', function() {
    var src = ['./dist/assets/images/**/*.*'];

    return gulp.src(src).pipe(md5(8, './dist/assets/css/**/*.css')).pipe(
        gulp.dest('./dist/assets/images'));
});

// MD5文件后缀命名
gulp.task('md5-html-images', ['html-images'], function() {
    var src = ['./dist/assets/images/**/*.*'];

    return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
        gulp.dest('./dist/assets/images'));
});

// MD5文件后缀命名
gulp.task('md5-css', function() {
    var src = ['./dist/assets/css/**/*.css'];

    return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
        gulp.dest('./dist/assets/css'));
});

// MD5文件后缀命名
gulp.task('md5-js', function() {
    var src = ['./dist/assets/js/**/*.js'];

    return gulp.src(src).pipe(md5(8, './dist/**/*.html')).pipe(
        gulp.dest('./dist/assets/js'));
});

// MD5文件后缀命名
gulp.task('md5', function(callback) {
    return gulpSequence('md5-images', 'md5-html-images', 'md5-font', 'md5-css',
        'md5-js', callback);
});
