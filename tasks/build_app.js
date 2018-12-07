const gulp = require("gulp");
const gulpWatch = require("gulp-watch");
const gulpBatch = require("gulp-batch");
const jetpack = require("fs-jetpack");
const bundle = require("./bundle");
const utils = require("./utils");

const projectDir = jetpack;
const srcDir = jetpack.cwd("./src");
const destDir = jetpack.cwd("./app");

gulp.task("bundle", () => {
    return Promise.all([
        bundle(srcDir.path("background.js"), destDir.path("background.js")),
        bundle(srcDir.path("app.js"), destDir.path("app.js"))
    ]);
});

gulp.task(
    "environment",
    gulp.series(done => {
        const configFile = `config/env_${utils.getEnvName()}.json`;
        projectDir.copy(configFile, destDir.path("env.json"), { overwrite: true });
        done();
    })
);

gulp.task(
    "watch",
    gulp.series(done => {
        const beepOnError = done => {
            return err => {
                if (err) {
                    utils.beepSound();
                }
                done(err);
            };
        };

        gulpWatch(
            "src/**/*.js",
            gulpBatch((events, done) => {
                gulp.start("bundle", beepOnError(done));
            })
        );
        done();
    })
);

gulp.task("build", gulp.series("bundle", "environment"));
