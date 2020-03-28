const express = require("express");
const router = express.Router();

module.exports = function() {
  router.get("/", (req, res) => {
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1;
    res.render("index");
  });

  router.get("/sample", (req, res) => {
    res.render("sample");
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.get("/signup", (req, res) => {
    res.render("signup");
  });

  return router;
};
