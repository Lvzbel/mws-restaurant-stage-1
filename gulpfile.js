var gulp = require('gulp');
var responsive = require('gulp-responsive');
var rename = require("gulp-rename");

gulp.task('image_1', function () {
  return gulp.src('img/*.jpg')
    .pipe(responsive({
      '*.jpg': {
        quality: 70
      }
    }))
    .pipe(rename(function (path) {path.basename += '_large_2x'}))
    .pipe(gulp.dest('img/responsive_img'));
});

gulp.task('image_2', function () {
  return gulp.src('img/*.jpg')
    .pipe(responsive({
      '*.jpg': {
        quality: 50
      }
    }))
    .pipe(rename(function (path) {path.basename += '_large_1x'}))
    .pipe(gulp.dest('img/responsive_img'));
});

gulp.task('image_3', function () {
  return gulp.src('img/*.jpg')
    .pipe(responsive({
      '*.jpg': {
        width: 500,
        quality: 70
      }
    }))
    .pipe(rename(function (path) {path.basename += '_small_2x'}))
    .pipe(gulp.dest('img/responsive_img'));
});

gulp.task('image_4', function () {
  return gulp.src('img/*.jpg')
    .pipe(responsive({
      '*.jpg': {
        width: 500,
        quality: 50
      }
    }))
    .pipe(rename(function (path) {path.basename += '_small_1x'}))
    .pipe(gulp.dest('img/responsive_img'));
});

// Original:  70 quality              _large_2x.jpg
// quality: 50 quality                _large_1x.jpg
// quality: 70 quality, width: 500    _small_2x.jpg
// quality: 50 quality, width: 500    _small_1x.jpg