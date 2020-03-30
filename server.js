/**
 * Let's build this application with best posible scalable
 */
// installing external dependancies
const express = require("express");
const app = express();
const ejs = require("ejs");
const LRU = require("lru-cache");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const mongoose = require("./config/mongooseConnection");
const MongoStore = require("connect-mongo")(expressSession);

// importing node.js dependancies
const path = require("path");
const fs = require("fs");

// importing application dependacies
const root = require("./Routes/root");
const auth = require("./lib/auth");

// some app livel configurations
require("dotenv").config({ path: "./configurations.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "website")));
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.COOKIESECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(auth.initialize);
app.use(auth.session);
app.use(auth.setUser);

// view engine configuration
app.set("view engine", "ejs");
app.set("views", "./views");
ejs.cache = new LRU(100);

// app middlewares

// routers starts from here
app.use("/", root());

// error handing in app
app.use((req, res, next) => {
  // 404 errors
  return res.send("404 error page");
});

app.use((err, req, res, next) => {
  console.log(err);
  // 500 errors
  const status = err.status || 500;
  res.status(status);
  return res.send("500 error page");
});

// app listening on port
let port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log("listening on " + port);
});
