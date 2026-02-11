var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));

gulp.task("sass", function () {
	gulp
		.src("./css/**/*.scss") // Путь к файлу sass './'-текущая папка '/css/' -папка проекта '/**/' -вложеные папки '/*.scss'- Все файлы с расширением SCSS
		.pipe(sass())
		.pipe(gulp.dest("./css/"));
});
gulp.task("sass:watch", function () {
	gulp.watch("./css/**/*.scss", ["sass"]);
});
