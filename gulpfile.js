var gulp = require('gulp');
var gm = require('gulp-gm');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var responsive = require('gulp-responsive');
var responsive = require('gulp-responsive');

// gulp.task('default', function () {
//   gulp.src('img/*')
//   .pipe(newer('resized'))
//   .pipe(gm(function(gmfile) {
//     gmfile.setFormat('jpg').quality(90);
//     return gmfile.resize(400, 300);
//   }))
//   .pipe(imagemin())
//   .pipe(gulp.dest('img/responsive_img'));
// });

// gulp.task('img', () =>
// 	gulp.src('img/*')
// 		.pipe(imagemin())
// 		.pipe(gulp.dest('img/responsive_img'))
// );

gulp.task('compress-images', function () {
  return gulp.src('img/*')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('.dist/images'));
})

gulp.task('default', function () {
  return gulp.src('img/*.jpg')
    .pipe(responsive({
      '*.jpg': {
        width: 400,
        quality: 50,
        rename: name + '_large_2x.jpg'
      }
    }))
    .pipe(gulp.dest('img/responsive_img'));
});


// Original:  70 quality              _large_2x.jpg
// quality: 50 quality                _large_1x.jpg
// quality: 70 quality, width: 500    _small_2x.jpg
// quality: 50 quality, width: 500    _small_1x.jpg