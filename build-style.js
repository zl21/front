const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// 编译less
gulp.task('css', function () {
  gulp.src('./src/assets/styles/index.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie > 8']
    }))
    .pipe(cleanCSS())
    .pipe(rename('r3-style.css'))
    .pipe(gulp.dest('./r3.publish/src'));
});

// 拷贝字体文件
// gulp.task('fontsclass', function () {
//   gulp.src('../src/styles/common/iconfont/fonts/*.*')
//     .pipe(less())
//     .pipe(autoprefixer({
//       browsers: ['last 2 versions', 'ie > 8']
//     }))
//     .pipe(cleanCSS())
//     .pipe(gulp.dest('../dist/styles/fonts'));
// });
// gulp.task('fonts', function () {
//   gulp.src('../src/styles/common/iconfont/fonts/*.*')
//     .pipe(gulp.dest('../dist/styles/fonts'));
// });
//拷贝iconfont
// gulp.task('icon', function () {
//   gulp.src('../src/styles/common/iconfont/bjIconfonts/*.*')
//     .pipe(gulp.dest('../dist/styles/bjIconfonts/'));
// });
//拷贝iconfont
// gulp.task('utils', function () {
//   gulp.src('../src/utils/wangEditor.min.js')
//     .pipe(gulp.dest('../dist'));
// });

gulp.task('default', ['css', ]);
