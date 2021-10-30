const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://budgettastic.herokuapp.com/google/callback",
        },
        async function (accessToken, refreshToken, profile, cb) {
            User.findOrCreate(
                { email: profile._json.email },
                function (err, user) {
                    return cb(err, user);
                }
            );
        }
    )
);
