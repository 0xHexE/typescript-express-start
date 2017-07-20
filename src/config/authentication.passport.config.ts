import * as passport from 'passport';
import { Application } from 'express';
import { Strategy as FacebookStrategy } from 'passport-facebook';

export function init(app: Application) {
    app.use(passport.initialize());
    app.use(passport.session());
}

function initFacebook(app: Application) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_RETURN_URL
    }, (accessToken: string, refreshToken: string, profile, done) => {
        done(null, profile);
    }));
}

