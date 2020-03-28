const express = require("express");
const router = express.Router();

/**
 * we can use middlewares in routers like this
 */
router.use(function(req, res, next) {
  res.send("Hello World");
  next();
});

// routers methods in express
/*
    router.all(), router.METHOD(), router.param(), router.route(), router.use()
*/
let middleware1 = function(req, res, next) {
  next();
};

let middleware2 = function(req, res, next) {
  next();
};

let middleware3 = function(req, res, next) {
  next();
};

router.all("*", middleware1, [middleware2, middleware3], (req, res) => {
  res.send("hello from router");
});

// work with router.param()
/*
    if we have any params in our end point we can use router.param to perform operations on param
    and it runs only once even though the endpoint matches multiple time
    and we can customize the behaviour of router.param see link bellow
    https://expressjs.com/en/4x/api.html#router.param
*/
router.param("id", function(req, res, next, id) {
  console.log("CALLED ONLY ONCE " + id);
  next();
});

router.get("/user/:id", function(req, res, next) {
  console.log("although this matches");
  next();
});

router.get("/user/:id", function(req, res) {
  console.log("and this matches too");
  res.end();
});

// if we have multiple params then we can go like this
router.param(["id", "page"], function(req, res, next, value) {
  console.log("CALLED ONLY ONCE with", value);
  next();
});

router.get("/user/:id/:page", function(req, res, next) {
  console.log("although this matches");
  next();
});

router.get("/user/:id/:page", function(req, res) {
  console.log("and this matches too");
  res.end();
});

// and we can customize the behaviour of router.param see link bellow
router.param("id", function(req, res, next, val) {
  if (val === String(1337)) {
    next();
  } else {
    res.send("not found anything");
    //   next("route"); to move from the current router
  }
});

// route to trigger the capture
router.get("/user/:id", function(req, res) {
  res.send("OK");
});

/**
 * app.route
 */
router
  .route("/users/:user_id")
  .all(function(req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    next();
  })
  .get(function(req, res, next) {
    res.json(req.user);
  })
  .put(function(req, res, next) {
    // just an example of maybe updating the user
    req.user.name = req.params.name;
    // save user ... etc
    res.json(req.user);
  })
  .post(function(req, res, next) {
    next(new Error("not implemented"));
  })
  .delete(function(req, res, next) {
    next(new Error("not implemented"));
  });

module.exports = router;
