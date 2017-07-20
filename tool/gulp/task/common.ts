/**
 * Created by ok on 7/10/17.
 */
import * as gulp from 'gulp';
import * as del from 'del';

gulp.task('clean-dist', () => {
    return del(['dist']);
});

gulp.task('default', () => {
    return console.log(`
    Hello ${process.env.USER}, Thanks For getting started.
    try this
    \'gulp run\'
    `);
});
