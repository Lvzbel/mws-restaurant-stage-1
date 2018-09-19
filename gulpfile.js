const gulp = require('gulp');
const responsive = require('gulp-responsive');
const rename = require("gulp-rename");
const livereload = require('gulp-livereload');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sourcemaps =  require('gulp-sourcemaps');
let uglify = require('gulp-uglify-es').default;
const minify = require('gulp-minify');

// FILE PATHS
const DIST_PATH = 'dist/'
const CSS_PATH = 'css/*.css'
const SCRIPTS_PATH = 'js/*js'
// =================================================
// Live Server using Watch
// =================================================
gulp.task('watch', () => {
  console.log('Starting watch task');
  require('./server.js');
  livereload.listen()
  gulp.watch(CSS_PATH, ['styles'])
  gulp.watch(SCRIPTS_PATH, ['scripts'])
});

// =================================================
// CSS compression
// =================================================
gulp.task('styles', () => {
  console.log('Starting Styles Task');
  return gulp.src(['css/styles.css', CSS_PATH])
  .pipe(plumber((err) => {
    console.log('Styles task error!');
    console.log(err);
    this.emit('end');
  }))
  .pipe(sourcemaps.init())
  .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
  .pipe(concat('styles.css'))
  .pipe(cssnano())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(DIST_PATH))
  .pipe(livereload())
})

// =================================================
// JavaScript compression
// =================================================
gulp.task('scripts', ['restaurants', 'restaurant', 'promiseDB'], () => {
  // Will run the two scripts right below
  })

gulp.task('restaurants', function (){
  console.log('Starting scrips task')

  return gulp.src(['js/dbhelper.js', 'js/main.js'])
    .pipe(plumber(function (err) {
      console.log('Scripts Task Error!');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('restaurants.js'))
    .pipe(sourcemaps.write())
    .pipe(minify())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

gulp.task('restaurant', function (){
  console.log('Starting scrips task')

  return gulp.src(['js/restaurant_info.js'])
    .pipe(plumber(function (err) {
      console.log('Scripts Task Error!');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(minify())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

gulp.task('promiseDB', function (){
  console.log('Starting scrips task')

  return gulp.src(['js/promiseDb.js'])
    .pipe(plumber(function (err) {
      console.log('Scripts Task Error!');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(minify())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

// =================================================
// Images will resize and compress all responsive images
// =================================================
gulp.task('images', ['image_1', 'image_2', 'image_3', 'image_4'], () => {
  // Original:  70 quality              _large_2x.jpg
  // quality: 50 quality                _large_1x.jpg
  // quality: 70 quality, width: 500    _small_2x.jpg
  // quality: 50 quality, width: 500    _small_1x.jpg
  })

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