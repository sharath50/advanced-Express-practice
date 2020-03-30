const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");

module.exports = function() {
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "login?error=true"
    })
  );

  router.post("/signup", function(req, res) {
    let { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.json({
        success: false,
        message: "all fields are neccessary"
      });
    }
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "passwords are not matching"
      });
    }
    User.getUserByEmail(email, function(err, user) {
      if (!err && user) {
        return res.json({
          success: false,
          message: "this email has been already registered"
        });
      } else {
        let newUser = new User({
          email,
          password
        });
        User.createUser(newUser, function(err, user) {
          if (!err && user) {
            res.json({
              success: true,
              message: "User registered successfully"
            });
          } else {
            res.json({ success: false, message: "User not registered" });
          }
        });
      }
    });
  });

  router.get("/logout", (req, res) => {
    // passport adds logout function to req object
    req.logOut();
    return res.redirect("/login");
  });

  return router;
};
