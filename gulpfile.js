require('./gulpfile.tasks.js');

const gulp = require('gulp');

gulp.task('dev', ['html'], function(callback) {
    // ext/images
    gulp.watch(['./src/ext/images/**/*.*'], ['html-ext-images']);

    // html
    gulp.watch(['./src/html/**/*.*'], ['html-include']);
});
