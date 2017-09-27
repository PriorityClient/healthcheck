var gulp = require('gulp');
var minify = require('gulp-minify');
var replace = require('gulp-replace');
var htmlmin = require('gulp-htmlmin');
var express = require('express');

var server = express();
server.use(express.static('./www'));

gulp.task('default', ['envSetup', 'copyLib', 'copyResources', 'compressJS'/*, 'htmlminify'*/]);
gulp.task('serve', ['envSetup', 'copyLib', 'copyResources', 'copyJS', 'startServer', 'watch']);

if(!process.env.API_ADDRESS) process.env.API_ADDRESS = "https://api.priorityclient.com/health_check";
if(!process.env.PROFILE_PAGE_ADDRESS) process.env.PROFILE_PAGE_ADDRESS = "https://vipcrowd.com/profile/evanshort";
if(!process.env.COMPANY_PAGE_ADDRESS) process.env.COMPANY_PAGE_ADDRESS = "https://vipcrowd.com/company/priorityclient";
if(!process.env.WORDPRESS_PAGE_ADDRESS) process.env.WORDPRESS_PAGE_ADDRESS = "https://hello.vipcrowd.com";

gulp.task('copyLib', function(){
  gulp.src(['src/lib/*', './node_modules/vanilla-text-mask/dist/vanillaTextMask.js'])
    .pipe(gulp.dest('www/'));
});
gulp.task('copyResources', function(){
  gulp.src(['src/*.png'])
    .pipe(gulp.dest('www/'));
});

gulp.task('copyJS', function(){
  gulp.src(['src/index.js'])
    .pipe(gulp.dest('www/'));
});

gulp.task('envSetup', function(){
  gulp.src('src/**/*.html')
    .pipe(replace("{{{API_ADDRESS}}}", process.env.API_ADDRESS))
    .pipe(replace("{{{PROFILE_PAGE_ADDRESS}}}", process.env.PROFILE_PAGE_ADDRESS))
    .pipe(replace("{{{COMPANY_PAGE_ADDRESS}}}", process.env.COMPANY_PAGE_ADDRESS))
    .pipe(replace("{{{WORDPRESS_PAGE_ADDRESS}}}", process.env.WORDPRESS_PAGE_ADDRESS))
    .pipe(gulp.dest('www/'));
});

gulp.task('compressJS', function() {
  gulp.src('src/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        }
    }))
    .pipe(gulp.dest('www'))
});

gulp.task('startServer', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(8200);
});

gulp.task('htmlminify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true}))
    .pipe(gulp.dest('www'));
});

gulp.task('watch', function() {

  //Add watching on js-files
  gulp.watch('src/**/*.js', function() {
    gulp.run('copyJS');
  });

  //Add watching on html-files
  gulp.watch('src/**/*.html', function () {
    gulp.run('envSetup');
  });
});
