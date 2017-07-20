import * as gulp from 'gulp';
import * as gulpMocha from 'gulp-mocha';
import * as gutil from 'gulp-util';
import { createProject } from 'gulp-typescript';
import * as path from 'path';

const tsProject = createProject(path.join(__dirname, '..', '..', '..', '/src/tsconfig.json'));

gulp.task('compile.ts-test', () => {
    return tsProject
        .src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('dist'));
});

// TODO: FIX typings.
gulp.task('test', ['clean-dist', 'compile-test'], () => {
    return gulp.src(['dist/**/*.test.js'], { read: false })
        .pipe(gulpMocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            } as any
        }))
        .on('error', gutil.log);
});

gulp.task('watch-test', ['clean-dist'], () => {
    return gulp.watch(['src/**/*.test.ts'], ['test'] as any);
});
