var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));

gulp.task("sass", function () {
	return gulp
		.src("./assets/css/scss/**/*.{scss,sass}")
		.pipe(sass())
		.pipe(gulp.dest("./assets/css/"));
});
gulp.task("sass:watch", function () {
	gulp.watch("./assets/css/scss/**/*.{scss,sass}", gulp.series("sass"));
});
