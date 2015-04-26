var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var errorify = require('errorify');
var watchify = require('watchify');
var gulpif = require('gulp-if');
var vinylPaths = require('vinyl-paths');
var gopen = require('gulp-open');
var ghPages = require('gulp-gh-pages');

var watching = false;

var paths = {
  less: 'src/less/*.less',
  libjs: [
    './bower_components/lodash/lodash.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/favico.js/favico.js',
    './bower_components/pnotify/pnotify.core.js',
    './bower_components/pnotify/!(pnotify.core).js',
    './bower_components/highlightjs/highlight.pack.js',

    './bower_components/angular/angular.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    './bower_components/angular-local-storage/dist/angular-local-storage.js',
    './bower_components/angular-pnotify/src/angular-pnotify.js',
    './bower_components/angular-highlightjs/build/angular-highlightjs.js',
    './bower_components/ng-table/dist/ng-table.js'
  ],
  libcss: [
    './bower_components/angular/angular-csp.css',
    './bower_components/pnotify/*.css',
    './bower_components/highlightjs/styles/github.css',
    './bower_components/ng-table/dist/ng-table.css'
  ],
  copycss: [
    './bower_components/bootstrap/dist/css/bootstrap.css',
    './bower_components/font-awesome/css/font-awesome.css'
  ],
  fonts: [
    './bower_components/font-awesome/fonts/*'
  ],
  favicon: [
    'favicon.ico'
  ],
  jade: ['src/jade/**/*.jade'],
  js: ['src/js/**/*.js'],
  entry: './src/js/main.js',
  dist: './dist/'
};

gulp.task('deploy', function() {
  return gulp.src(paths.dist + '**/*')
    .pipe(ghPages());
});

gulp.task('clean', function () {
  return gulp.src(paths.dist)
    .pipe(vinylPaths(del))
    .on('error', gutil.log);
});

gulp.task('copyfonts', ['clean'], function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist + '/fonts'))
    .on('error', gutil.log);
});

gulp.task('copyfavicon', ['clean'], function () {
  return gulp.src(paths.favicon)
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('buildlibcss', ['clean'], function() {
  return gulp.src(paths.libcss)
    .pipe(concat('lib.css'))
    .pipe(gulpif(!watching, minifycss({
      keepSpecialComments: false,
      removeEmpty: true
    })))
    .pipe(gulp.dest(paths.dist + 'css'))
    .on('error', gutil.log);
});

gulp.task('copylibcss', ['clean'], function() {
  return gulp.src(paths.copycss)
    .pipe(gulpif(!watching, minifycss({
      keepSpecialComments: false,
      removeEmpty: true
    })))
    .pipe(gulp.dest(paths.dist + 'css'))
    .on('error', gutil.log);
});

gulp.task('copylibjs', ['clean'], function () {
  return gulp.src(paths.libjs)
    .pipe(gulpif(!watching, uglify({outSourceMaps: false})))
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(paths.dist + 'js'))
    .on('error', gutil.log);
});

gulp.task('compilejs', ['jscs', 'jshint' ,'clean'], function () {
  var bundler = browserify({
    cache: {}, packageCache: {}, fullPaths: true,
    entries: [paths.entry],
    debug: watching
  })
    .transform(babelify);

  if(watching) {
    bundler.plugin(errorify);
  }

  var bundlee = function() {
    return bundler
      .bundle()
      .pipe(source('js/main.min.js'))
      .pipe(gulpif(!watching, streamify(uglify({outSourceMaps: false}))))
      .pipe(gulp.dest(paths.dist))
      .on('error', gutil.log);
  };

  if (watching) {
    bundler = watchify(bundler);
    bundler.on('update', bundlee);
  }

  return bundlee();
});

gulp.task('jshint', function() {
  return gulp.src(paths.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .on('error', gutil.log);
});

gulp.task('jscs', function() {
  return gulp.src(paths.js)
    .pipe(jscs())
    .on('error', gutil.log);
});

gulp.task('compileless', ['clean'], function () {
  return gulp.src(paths.less)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('css/main.css'))
    .pipe(gulpif(!watching, minifycss({
      keepSpecialComments: false,
      removeEmpty: true
    })))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('compilejade', ['clean'], function() {
  return gulp.src(paths.jade)
    .pipe(concat('index.html'))
    .pipe(jade({
      pretty: watching
    }))
    .pipe(gulpif(!watching, minifyhtml()))
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('html', ['build'], function(){
  return gulp.src('dist/*.html')
    .pipe(connect.reload())
    .on('error', gutil.log);
});

gulp.task('connect', function () {
  connect.server({
    root: ['./dist'],
    port: 8000,
    livereload: true
  });
});

gulp.task('open', function() {
  gulp.src('./dist/index.html')
    .pipe(gopen('', {
      url: 'http://localhost:8000'
    }));
});

gulp.task('watch', function () {
  watching = true;
  return gulp.watch([paths.less, paths.jade, paths.js], ['html']);
});

gulp.task('default', ['build', 'connect', 'open', 'watch']);
gulp.task('build', ['clean', 'copyfavicon', 'copylibjs', 'copylibcss', 'buildlibcss', 'compile']);
gulp.task('compile', ['copyfonts', 'compilejs', 'compileless', 'compilejade']);
