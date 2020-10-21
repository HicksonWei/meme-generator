const { src, dest, series } = require('gulp')
const htmlreplace = require('gulp-html-replace')
// const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const strip = require('gulp-strip-comments')
const rename = require('gulp-rename')
const imagemin = require('gulp-imagemin')
const ghPages = require('gulp-gh-pages')

function htmlCompiler() {
	return src('src/index.html')
		.pipe(
			htmlreplace({
				css: './css/style.css',
				js: {
					src: './js/bundle.js',
					tpl: '<script src="%s" defer></script>'
				}
			})
		)
		.pipe(dest('public/'))
}

function sassCompiler() {
	return (
		src('./src/tmp/*.css')
			.pipe(sourcemaps.init())
			// .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
			.pipe(postcss([autoprefixer()]))
			.pipe(cleanCSS())
			.pipe(sourcemaps.write('./'))
			.pipe(dest('public/css/'))
	)
}

function jsCompiler() {
	return src('./src/tmp/*.js')
		.pipe(sourcemaps.init())
		.pipe(strip())
		.pipe(
			uglify({
				compress: {
					drop_console: true
				}
			})
		)
		.pipe(rename('bundle.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(dest('public/js/'))
}

function imageMinify() {
	return src('./src/img/*').pipe(imagemin()).pipe(dest('public/img/'))
}

function deploy() {
	return src('./public/**/*').pipe(ghPages())
}

exports.build = series(
	htmlCompiler,
	sassCompiler,
	jsCompiler,
	imageMinify,
	deploy
)
