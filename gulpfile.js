var gulp = require('gulp');
var gm = require('gulp-gm');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

gulp.task('default', function () {
  gulp.src('img/*')
  .pipe(newer('resized'))
  .pipe(gm(function(gmfile) {
    gmfile.setFormat('jpg').quality(90);
    return gmfile.resize(400, 300);
  }))
  .pipe(imagemin())
  .pipe(gulp.dest('img/responsive_img'));
});