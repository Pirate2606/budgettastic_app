const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "https://budgettastic.herokuapp.com/github/callback",
            scope: ["user:email"],
        },
        async function (accessToken, refreshToken, profile, cb) {
            User.findOrCreate(
                { email: profile.emails[0].value },
                function (err, user) {
                    return cb(err, user);
                }
            );
        }
    )
);
