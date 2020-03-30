const express = require("express");
const router = express.Router();

let authentication = require("./authentication");

module.exports = function() {
  let redirectLoggedOne = (req, res, next) => {
    if (req.user) return res.redirect("/");
    return next();
  };

  router.get(
    "/",
    (req, res, next) => {
      if (req.user) {
        return next();
      }
      return res.redirect("/login");
    },
    (req, res) => {
      res.render("index");
    }
  );

  router.get("/login", redirectLoggedOne, (req, res) => {
    res.render("login", { error: req.query.error });
  });

  router.get("/signup", redirectLoggedOne, (req, res) => {
    res.render("signup");
  });

  router.use("/", authentication());

  return router;
};
