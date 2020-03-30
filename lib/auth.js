const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");

passport.use(
  new LocalStrategy(
    {
      // default values are username, password to change them we have to change like bellow
      // then we can pass email, password as parameter, otherwise it should be username, password
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, done) {
      User.getUserByEmail(email, function(err, user) {
        if (err) return done(err);
        if (!user)
          return done(null, false, {
            message: "That email is not registered"
          });
        User.comparePassword(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    }
  )
);

// adds uses into session
passport.serializeUser((user, done) => {
  //cb(err, user)
  done(null, user.id);
});

// removes user from session
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    // cb(err, user)
    done(null, user);
  });
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  setUser: function(req, res, next) {
    res.locals.user = req.user;
    return next();
  }
};
