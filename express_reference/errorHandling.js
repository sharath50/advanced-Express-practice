/**
 * included module dependancies after installed from npm
 */
const express = require("express"),
  app = express();

// VERY IMPORTANT : error handling in express app
// if error accures in synchronous operation like bellow then use throw
app.get("/data", (req, res, next) => {
  // throw new Error("unexpected error accured");
  next(new Error("unexpected error accured"));
  // it is safe to use next(err) everywhere, for error handling
});

function middle(req, res, next) {
  // bellow both works since they are in syncronous operation
  // return next(new Error());
  // throw new Error();
  setTimeout(() => {
    return next(new Error("unexpected error accured")); // next(err) is neccessary
  }, 500);
}

// if error accures in asynchronous operation like bellow then use next(err)
app.get("/data2", [middle], (req, res, next) => {
  res.send("hello");
  // setTimeout(() => {
  //   // do not use throw in asynchronous operation, it will crash our application
  //   // next(err) is needed here, because the error is comming from asyncronous operation, so throw doesn't works
  //   return next(new Error("unexpected error accured"));
  // }, 500);
});

app.get("/data3", (req, res, next) => {
  setTimeout(() => {
    res.send("hello iam alive");
  }, 500);
});

app.use((req, res, next) => {
  return res.send("404 error page");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status);
  return res.send("500 error page");
});

let appPort = 3500;
app.listen(appPort, () => {
  console.log(`app running on port ${appPort}`);
});
