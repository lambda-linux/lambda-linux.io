'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var del = require('del');
var extend = require('util')._extend;
var fs = require('fs');
var merge = require('merge-stream');
var path = require('path');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;

var handlebarOpts = {
  batch: ['./hbs-partials'],
  helpers: {
    assetPath: function(path, context) {
      return ['', context.data.root[path]].join('/');
    }
  }
};

var AUTOPREFIXER_BROWERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var DIST = 'dist';
var TMP = 'tmp';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

var tmp = function(subpath) {
  return !subpath ? TMP : path.join(TMP, subpath);
};

gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(tmp('rev-pre/images')));
});

gulp.task('css', function() {
  return gulp.src('styles/main.css')
    .pipe($.autoprefixer(AUTOPREFIXER_BROWERS))
    .pipe($.minifyCss())
    .pipe(gulp.dest(tmp('rev-pre/css')));
});

gulp.task('webcomponentsjs', function() {
  return gulp.src('bower_components/webcomponentsjs/webcomponents-lite.min.js')
    .pipe(gulp.dest(tmp('rev-pre/js')));
});

gulp.task('vulcanize', function() {
  return gulp.src(['elements/elements.html'])
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(tmp('rev-vulcanize-pre/elements')));
});

gulp.task('vulcanize-home', function() {
  return gulp.src(['elements/home/elements.html'])
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(tmp('rev-vulcanize-pre/elements/home')));
});

gulp.task('vulcanize-faqs', function() {
  return gulp.src(['elements/faqs/elements.html'])
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(tmp('rev-vulcanize-pre/elements/faqs')));
});

gulp.task('vulcanize-support', function() {
  return gulp.src(['elements/support/elements.html'])
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(tmp('rev-vulcanize-pre/elements/support')));
});

gulp.task('vulcanize-community', function() {
  return gulp.src(['elements/community/elements.html'])
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(tmp('rev-vulcanize-pre/elements/community')));
});

gulp.task('vulcanize-blog', function() {
  return gulp.src(['elements/blog/elements.html'])
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(tmp('rev-vulcanize-pre/elements/blog')));
});

gulp.task('rev-vulcanize', function() {
  var TMP_REV_POST = tmp('rev-post');

  return gulp.src(tmp('rev-vulcanize-pre/**/*'), {base: tmp('rev-vulcanize-pre')})
    .pipe($.rev())
    .pipe(gulp.dest(TMP_REV_POST))
    .pipe($.rev.manifest('rev-manifest-styles.json'))
    .pipe(gulp.dest(TMP));
});

gulp.task('rev', function() {
  var TMP_REV_POST = tmp('rev-post');

  return gulp.src(tmp('rev-pre/**/*'), {base: tmp('rev-pre')})
    .pipe($.rev())
    .pipe(gulp.dest(TMP_REV_POST))
    .pipe($.rev.manifest('rev-manifest-images-js-css.json'))
    .pipe(gulp.dest(TMP));
});

gulp.task('hbs-elements', function() {
  var manifest = JSON.parse(fs.readFileSync(tmp('rev-manifest-images-js-css.json', 'utf8')));

  return gulp.src('elements/home/home-hero/home-hero.html.hbs')
    .pipe($.compileHandlebars(manifest, handlebarOpts))
    .pipe($.rename('home-hero.html'))
    .pipe(gulp.dest('elements/home/home-hero'));
});

gulp.task('hbs-styles', function() {
  var manifest = JSON.parse(fs.readFileSync(tmp('rev-manifest-images-js-css.json', 'utf8')));

  return gulp.src('styles/shared-styles.html.hbs')
    .pipe($.compileHandlebars(manifest, handlebarOpts))
    .pipe($.rename('shared-styles.html'))
    .pipe(gulp.dest('styles'));
});

gulp.task('hbs', function() {
  var manifest = JSON.parse(fs.readFileSync(tmp('rev-manifest-images-js-css.json', 'utf8')));

  extend(manifest, JSON.parse(fs.readFileSync(tmp('rev-manifest-styles.json', 'utf8'))));

  return gulp.src('hbs/**/*.hbs')
    .pipe($.compileHandlebars(manifest, handlebarOpts))
    .pipe($.rename(function(path) {
      path.extname = '.html';
      return path;
    }))
    .pipe(gulp.dest(tmp('hbs-post')));
});

gulp.task('hbs-jekyll', function() {
  var manifest = JSON.parse(fs.readFileSync(tmp('rev-manifest-images-js-css.json', 'utf8')));

  extend(manifest, JSON.parse(fs.readFileSync(tmp('rev-manifest-styles.json', 'utf8'))));

  var hbsJekyllLayouts = gulp.src('hbs-jekyll/_layouts/*.hbs')
    .pipe($.compileHandlebars(manifest, handlebarOpts))
    .pipe($.rename(function(path) {
      path.extname = '.html';
      return path;
    }))
    .pipe(gulp.dest(tmp('hbs-jekyll-post/_layouts')));

  var hbsJekyllPosts = gulp.src('hbs-jekyll/_posts/*.hbs')
    .pipe($.compileHandlebars(manifest, handlebarOpts))
    .pipe($.rename(function(path) {
      path.extname = '.md';
      return path;
    }))
    .pipe(gulp.dest(tmp('hbs-jekyll-post/_posts')));

  return merge(hbsJekyllLayouts, hbsJekyllPosts);
});

// Clean up prior to copying generated hbs files
gulp.task('jekyll-pre-copy-cleanup', function() {
  return del([
    'jekyll/_layouts/blog.html',
    'jekyll/_layouts/blog_post.html',
    'jekyll/_posts/2015-01-28-announcing-firefox-browser-support-for-amazon-linux.md',
    'jekyll/_posts/2015-05-07-announcing-schemaspy-support-for-amazon-linux.md'
  ]);
});

// Copy files generated by processing hbs into jekyll
gulp.task('jekyll-pre-copy', function() {
  return gulp.src(tmp('hbs-jekyll-post/**/*'))
    .pipe(gulp.dest('jekyll'));
});

// Run jekyll task
gulp.task('jekyll', function(gulpCallBack) {
  var jekyll = spawn('jekyll',
    ['build', '--incremental', '-s', 'jekyll', '-d', tmp('jekyll')],
    {stdio: 'inherit'});

  jekyll.on('exit', function(code) {
    gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
  });
});

// Copy `favicon` to dist
gulp.task('copy-favicon', function() {
  return gulp.src('favicon/favicon.ico')
    .pipe(gulp.dest('dist'));
});

// Copy `opt/` to dist
gulp.task('copy-opt', function() {
  return gulp.src('opt/**/*', {base: '.'})
    .pipe(gulp.dest('dist'));
});

// Copy `extras` to dist
gulp.task('copy-extras', function() {
  var copyEpllReleaseRPM =
  gulp.src('extras/epll-release-2015.09-1.1.ll1.noarch.rpm')
    .pipe(gulp.dest('dist'));

  var copyRPMGPGKEY = gulp.src('extras/RPM-GPG-KEY-lambda-epll')
    .pipe(gulp.dest('dist'));

  return merge(copyEpllReleaseRPM, copyRPMGPGKEY);
});

gulp.task('gzip-pre', function() {
  var hbsPost = gulp.src(tmp('hbs-post/**/*.html'))
    .pipe(gulp.dest(tmp('gzip-pre')));

  var revPost = gulp.src(tmp('rev-post/**/*'))
    .pipe(gulp.dest(tmp('gzip-pre')));

  var jekyllPost = gulp.src(tmp('jekyll/**/*'))
    .pipe(gulp.dest(tmp('gzip-pre')));

  return merge(hbsPost, revPost, jekyllPost);
});

gulp.task('gzip-post', function() {
  var vanillaCopy = gulp.src(tmp('gzip-pre/**/*'))
    .pipe(gulp.dest(dist()));

  var gzipCopy = gulp.src(tmp('gzip-pre/**/*'))
    .pipe($.gzip())
    .pipe(gulp.dest(dist()));

  return merge(vanillaCopy, gzipCopy);
});

// Lint JavaScript
gulp.task('lint', function() {
  // NOTE: `.jscsrc` and `.jshintrc` files are required to be present
  return gulp.src([
    'scripts/**/*.js',
    'elements/**/*.js',
    'elements/**/*.html',
    'gulpfile.js'
  ])
  // JSCS has not yet a extract option
  .pipe($.if('*.html', $.htmlExtract()))
  .pipe($.jshint())
  .pipe($.jscs())
  .pipe($.jscsStylish.combineWithHintResults())
  .pipe($.jshint.reporter('jshint-stylish'));
});

// Clean output directory
gulp.task('clean-pre', function() {
  return del([tmp(), dist()]);
});

// Clean artifacts not present in `tmp/` and `dist/`
gulp.task('clean-post', function() {
  return del(['styles/shared-styles.html', 'elements/home/home-hero/home-hero.html']);
});

// Build production files, the default task
gulp.task('default', ['clean-pre'], function(cb) {
  runSequence(
    ['images', 'css', 'webcomponentsjs'],
    'rev',
    'hbs-styles',
    'hbs-elements',
    ['vulcanize', 'vulcanize-home', 'vulcanize-faqs', 'vulcanize-support',
     'vulcanize-community', 'vulcanize-blog'],
    'rev-vulcanize',
    'hbs',
    'hbs-jekyll',
    'jekyll-pre-copy-cleanup',
    'jekyll-pre-copy',
    'jekyll',
    'gzip-pre',
    'gzip-post',
    'copy-favicon',
    'copy-opt',
    'copy-extras',
    'clean-post',
    cb);
});
