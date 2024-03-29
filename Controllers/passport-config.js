const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// USER MODEL
const User = require('../models/user')

module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
        User.findOne({
          email: email
        }).then(user => {
          
          if (!user) { 
            return done(null, false, { message: 'Email and Password is not valid' });
          }
  
          try {
               // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Email and Password is not valid' });
            }
          }); 
          } catch (error) {
            return done(error) 
          }
        
        });
      })
    );
  
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
  };