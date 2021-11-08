// 用10.16.3版本的node可以执行脚本。node版本高gulp插件会报错。或者升级下框架的gulp
const gulp = require('gulp'); 
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// 编译less
gulp.task('css', () => {
  gulp.src('../index.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie > 8']
    }))
    .pipe(cleanCSS())
    .pipe(rename('r3-style.css'))
    .pipe(gulp.dest('../../r3.publish/src'));
});

gulp.task('default', ['css']);

