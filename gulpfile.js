import gulp from "gulp";
import path from "path";
import gulpZip from "gulp-zip";

export function createDist() {
  return gulp
    .src(
      [
        path.join("static", "**"),
        path.join("templates", "**"),
        path.join("app", "**"),
        "setup.py",
        "README.md",
      ],
      {
        base: ".",
      }
    )
    .pipe(gulp.dest("dist"));
}

export function zipDist() {
  return gulp
    .src(path.join("dist", "**"))
    .pipe(gulpZip("build.zip"))
    .pipe(gulp.dest("."));
}

export const zip = gulp.series(createDist, zipDist);
