const passport = require('passport');
const keys = require('./keys');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

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
      callbackURL: 'https://radiant-ocean-11743.herokuapp.com/google/callback',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    function (accessToken, refreshToken, profile, done) {
      //use the profile info (mainly profile id)to check if the user is registerd in your db
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
      });
    }
  )
);
