var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../db/models/users');
var configAuth = require('../../config/auth');
// expose this function to our app using module.exports
module.exports = function(passport) {

    // passport session setup
    // required for persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
            done(err, user);
    });
    
    // FACEBOOK 
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL

        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // check if already in database
                User.findOne({ 'facebook.id': profile.id }, function(err, user) {

                    if (err)
                        return done(err);

                    // if user found just login
                    if (user) {
                        return done(null, user); 
                    } else {
                        // if no user found new user created
                        var user = new User();

                        user.facebook.id = profile.id;                   
                        user.facebook.token = token; 
                        user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; 
                        user.facebook.email = profile.emails[0].value;
                        // save our user to the database
                        user.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, user);
                        });
                    }

                });
            });

        }));

    // GOOGLE
    passport.use(new GoogleStrategy({

            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,

        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {

                // check if user already in db
                User.findOne({ 'google.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if user found, just login
                        return done(null, user);
                    } else {
                        var user = new User();

                        user.google.id = profile.id;
                        user.google.token = token;
                        user.google.name = profile.displayName;
                        user.google.email = profile.emails[0].value;

                        // save the user
                        user.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                    }
                });
            });

        }));

};