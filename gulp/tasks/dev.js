var gulp = require('gulp');

gulp.task('dev', function() {
  process.env.NODE_ENV = 'development';
  gulp.start('watch');
});
