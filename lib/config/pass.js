'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');


//###############FACEBOOK##################

var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');

//##################END####################


// Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});



//###############FACEBOOK##################

  passport.use(new FacebookStrategy({

  // pull in our app id and secret from our auth.js file
      // clientID        : configAuth.facebookAuth.clientID,
      // clientSecret    : configAuth.facebookAuth.clientSecret,
      // callbackURL     : configAuth.facebookAuth.callbackURL

      clientID        : '495683320543553',
      clientSecret    : '327f5fb4fc3486b038a2413839019c9c',
      callbackURL     : 'http://localhost:8000/auth/facebook/callback',
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
    console.log('in pass.js facebook' + profile);
    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
            if (err)
                return done(err);

      // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newUser            = new User();

        // set all of the facebook information in our user model
                newUser.facebook.id    = profile.id; // set the users facebook id                 
                newUser.facebook.token = token; // we will save the token that facebook provides to the user                  
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

        // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newUser);
                });
            }
        });
      });
  }));


//##################END####################


// Use local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          'errors': {
            'email': { type: 'Email is not registered.' }
          }
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          'errors': {
            'password': { type: 'Password is incorrect.' }
          }
        });
      }
      return done(null, user);
    });
  }
));
