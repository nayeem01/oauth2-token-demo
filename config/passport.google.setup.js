const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { Google_ClientID, Google_ClientSecret } = require("./config");
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

const googleStrategy = new GoogleStrategy(
    {
        clientID: Google_ClientID,
        clientSecret: Google_ClientSecret,
        callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                console.log("existed user: ", currentUser);
                return done(null, false, {
                    message: "this mail already registered",
                });
            } else {
                User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                }).then((newUser) => {
                    console.log("created new user: ", newUser);
                    return done(null, newUser);
                });
            }
        });
    }
);

passport.use(googleStrategy);
