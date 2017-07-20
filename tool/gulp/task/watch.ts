import { task, watch, log, src } from 'gulp';
import { join } from 'path';

task('watch', ['start'],() => {
    watch(join('.', 'src', '**/*.ts'), ['start'])
});
