var gulp = require('gulp');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
require('babel-core/register')();

gulp.task('babel', ['test'], function() {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['babel', 'test']);
});

gulp.task('test', function() {
    return gulp.src(['test/*.js'])
        .pipe(mocha({
            reporter: 'spec'
        }))
        .on('error', function(err) {
            console.log(err.stack);
        });
});

gulp.task('watch-test', function() {
    gulp.watch('**/*.js', ['test']);
});

gulp.task('default', ['babel']);
