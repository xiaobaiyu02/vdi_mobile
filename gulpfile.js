var gulp = require("gulp"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	ng_html = require("gulp-ng-html2js"),
	css = require("gulp-minify-css"),
	html = require("gulp-minify-html"),
	jshint = require("gulp-jshint"),
	merge = require("merge2");

gulp.task("js", function(){
	var js = gulp.src([
		"bower_components/jquery/dist/jquery.js",
		"bower_components/bootstrap/dist/js/bootstrap.js",
		"bower_components/angular/angular.js",
		"bower_components/angular-animate/angular-animate.js",
		"bower_components/angular-route/angular-route.js",
		"bower_components/angular-resource/angular-resource.js",
		"bower_components/angular-touch/angular-touch.js",
		"bower_components/angular-sanitize/angular-sanitize.js",
		"src/js/app.js",
		"src/js/resource.js",
		"src/js/ctrl/HostController.js",
		"src/js/ctrl/HomeController.js",
		"src/js/ctrl/ConfirmController.js",
		"src/js/ctrl/ClassRoomController.js"
	]);
	var tpl = gulp.src("src/tpl/*.html").pipe(ng_html({
		moduleName: "vdi",
		prefix: "tpl/"
	}));

	return merge(merge(js), merge(tpl))
		//.pipe(uglify({ mangle: false }))
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest("dist/js"));
});

gulp.task("css", function(){
	return gulp.src([
			"bower_components/bootstrap/dist/css/bootstrap.css",
			"src/css/app.css",
			"src/css/pop.css",
			"src/css/main.css",
			"src/css/font.css"
		])
		.pipe(css({ keepBreaks: true }))
		.pipe(concat("app.css"))
		.pipe(gulp.dest("dist/css"))
});

gulp.task("img", function(){
	gulp.src(["src/images/**"])
		.pipe(gulp.dest("dist/images"));
});

gulp.task("fonts", function(){
	gulp.src(["src/font/**"])
		.pipe(gulp.dest("dist/font"));
});

gulp.task("jshint", function(){
	gulp.src(["src/js/**/*.js"])
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
});


gulp.task("default", [
	//"jshint",
	"js", "css", "img", "fonts"
]);