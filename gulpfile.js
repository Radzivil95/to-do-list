"use strict";

const {src, dest} = require("gulp");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const gutil = require('gulp-util');
const rename = require("gulp-rename");
const removeComments = require("gulp-strip-css-comments");
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const del = require("del");

const srcFolder = "src/";
const distFolder = "dist/";

const path = {
  build: {
      html: distFolder,
      css: distFolder + "assets/css/",
      js: distFolder + "assets/js/",
      images: distFolder + "assets/images/",
      fonts: distFolder + "assets/fonts/",
  },
  src: {
      html: srcFolder + "*.html",
      css: srcFolder + "assets/scss/*.scss",
      js: srcFolder + "assets/js/*.js",
      images: srcFolder + "assets/images/**/*.{jpeg,png,svg,gif,ico,webp,webmanifest,xml,json,jpg}",
      fonts: srcFolder + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
  },
  watch: {
      html: srcFolder + "**/*.html",
      css: srcFolder + "assets/scss/**/*.scss",
      js: srcFolder + "assets/js/**/*.js",
      images: srcFolder + "assets/images/**/*.{jpeg,png,svg,gif,ico,webp,webmanifest,xml,json,jpg}",
      fonts: srcFolder + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
  },
  clean: "./" + distFolder,
};

function serve() {
  browserSync.init({
      server: {
          baseDir: "./" + distFolder
      }
  });
}

function html() {
  return src(path.src.html, {base: srcFolder})
         .pipe(plumber())
         .pipe(dest(path.build.html))
         .pipe(browserSync.reload({stream: true}));
}

function css() {
  return src(path.src.css, {base: srcFolder + "assets/scss/"})
  .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
      })
      )
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(cssbeautify())
      .pipe(dest(path.build.css))
      .pipe(cssnano({
          zindex: false,
          discardComment: {
              removeAll: true
          },
      }))
      .pipe(removeComments())
      .pipe(rename({
          suffix: ".min",
          extname: ".css",
      }))
      .pipe(dest(path.build.css))
      .pipe(browserSync.reload({stream: true}));
}

function js() {
  return src(path.src.js, {base: srcFolder + "assets/js/"})
      .pipe(plumber())
      .pipe(webpack({
        mode: "development",
        output: {
          filename: 'app.min.js',
        }
      }))
      .pipe(dest(path.build.js))
      .pipe(browserSync.reload({stream: true}));
}
function images() {
  return src(path.src.images, {base: srcFolder + "assets/images/"})
      .pipe(imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.mozjpeg({quality: 80, progressive: true}),
          imagemin.optipng({optimizationLevel: 5}),
          imagemin.svgo({
              plugins: [
                  {removeViewBox: true},
                  {cleanupIDs: false}
              ]
          })
      ]))
      .pipe(webp())
      .pipe(dest(path.build.images))
      .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return src(path.src.fonts, {base: srcFolder + "assets/fonts/"})
  .pipe(dest(path.build.fonts))
  .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);

}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, serve);

exports.build = build;
exports.watch = watch;
exports.default = watch;