import { task, watch, log, src } from 'gulp';

let node;
import { spawn } from 'child_process';

task('start', ['compile'],() => {
    if (node) {
        node.kill();
    }
    node = spawn('node', ['./dist/bin/www.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            log('Error detected, waiting for changes...');
        }
    });
    node.on('error', (error) => {
        console.error(error);
    });
});
