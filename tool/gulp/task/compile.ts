import { task, src, dest } from 'gulp';
import { createProject } from 'gulp-typescript';

const tsProject = createProject('./src/tsconfig.json');

task('compile', function() {
    return tsProject
        .src()
        .pipe(tsProject())
        .js.pipe(dest('dist'));
});
