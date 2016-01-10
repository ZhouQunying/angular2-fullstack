// const gulp = require('gulp');
// const babel = require('gulp-babel');
// const sourcemaps = require('gulp-sourcemaps');
// const concat = require('gulp-concat');
	
import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';

const dirs = {
	src: 'src',
	dest: 'dist'
}

gulp.task('default', () => {
    return gulp.src('server/**/*.js')
        .pipe(sourcemaps.init())
        // .pipe(babel({
        //     presets: ['es2015']
        // }))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
})