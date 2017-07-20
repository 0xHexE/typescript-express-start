"use strict";
exports.__esModule = true;
var passport = require("passport");
var passport_facebook_1 = require("passport-facebook");
function init(app) {
    app.use(passport.initialize());
    app.use(passport.session());
}
exports.init = init;
function initFacebook(app) {
    passport.use(new passport_facebook_1.Strategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_RETURN_URL
    }, function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }));
}
