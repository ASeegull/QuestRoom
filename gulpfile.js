let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence'),
  concat = require('gulp-concat-css'),
  del = require('del'),
  copy = require('gulp-copy'),
  destination = 'docs',
  cssnano = require('gulp-cssnano'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify');


gulp.task('sass', () => {
  return gulp.src('dev/styles/*.sass')
    .pipe(sass())
    .pipe(prefixer({
      browsers: ["last 3 version", "> 1%", "ie 8", "ie 9", "Opera 12.1"],
      cascade: false
    }))
    .pipe(gulp.dest('dev/styles'))
});

gulp.task('browse', ['sass'], () => {
  browserSync.init({
    server: {
      baseDir: 'dev'
    },
    notify: false
  });

  gulp.watch('dev/styles/*.sass', ['sass']);
  // gulp.watch('dev/es6/*.js', ['js']);
  browserSync.watch(['dev/*.html', 'dev/styles/*.css', 'scripts/*.js']).on('change', browserSync.reload);
});


gulp.task('del', () => {
  return del(destination)
});


gulp.task('copy', () => {
  let sourceFiles = ['dev/images/*.png', 'dev/fonts/*.*', 'dev/*.html'];
  return gulp
    .src(sourceFiles)
    .pipe(copy(destination, {
      prefix: 1
    }));
});

gulp.task('css-prod', function() {
  return gulp.src('dev/styles/*.css')
    .pipe(concat('style.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('docs/styles'));
});

gulp.task('js-prod', () => {
  return gulp.src(['dev/scripts/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('docs/scripts'));
});

gulp.task('default', ['browse']);

gulp.task('prod', function() {
  runSequence('del', ['css-prod'], 'copy');
});