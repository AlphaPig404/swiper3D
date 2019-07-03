var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
 
gulp.task('scripts', function() {
    return gulp.src('src/index.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('dist/'));
});
 
gulp.task('sasscss', function () {
    return gulp.src('src/css/*.scss')
    .pipe(sass()).on('error', function (err) {console.error('Error!', err.message);})
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('watch', gulp.series('scripts','sasscss', function() {
    gulp.watch('src/**/*.ts', gulp.series('scripts'));
    gulp.watch('src/css/*.scss', gulp.series('sasscss'));
}));




