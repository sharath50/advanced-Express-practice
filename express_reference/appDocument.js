/**
 * included module dependancies after installed from npm
 */
const express = require("express"),
  app = express(),
  dotenv = require("dotenv");

/**
 * included native modules from node js
 */
const path = require("path");

/**
 * included module dependancies after exported using module.exports
 */
const firstRouter = require("../Routers/firstRouter");
app.use("/firstRouter", firstRouter);

/**
 * app settings using app methods in express
 */
// refer this direct link - https://expressjs.com/en/4x/api.html#app.set
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
console.log(app.get("views"));

// using express behind proxy
app.set("trust proxy", "loopback");

// we can set custom key values to express for out use
app.set("appName", "explore advanced express"); // setting the value in app
console.log(app.get("appName")); // getting the value in app

app.set("case sensitive routing", true); // if "true" - "/Foo" and "/foo" are different if "false" they are same
/*
case sensitive routing - boolean
env - process.env.NODE_ENV
etag - varied
json escape - boolean
strict routing - boolean // "/foo/" and "/foo" are different if enabled
view engine - string // view engine name
views - string or array // Default : process.cwd() + '/views'
x-powered-by - boolean // to enable and disable x-powered-by in res
*/

/**
 * to customize the view engine
 */
// app.engine("html", require("pug").__express); // this is for pug
app.engine("html", require("ejs").renderFile); // this is for ejs
// if we are using any other template engine
// they don't provide this type of options, so use consolidate.js library it will help you
// var engines = require("consolidate");
// app.engine("haml", engines.haml);
// app.engine("html", engines.hogan);

// built in middlewares in express
/*
    express.json(), express.raw(), express.Router(), express.static(), express.text(), express.urlencoded()
*/
app.use(express.json());
// while sending json format data

app.use(express.urlencoded({ extended: true }));
// while sending x-www-form-urlencoded name = sharath
// while sendding array names[] = sharath , names[] = mohan
// while sendding array of items names[0] = sharath , name[1] = mohan
// sending object of key value names[name] = sharath , names[age] = 24
// == viewdirectory/1?color[]=1&color[]=2&color[]=3 // gives in array format
// == viewdirectory/1?color=[1,2,3,4] // gives in string format
// == /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
// console.dir(req.query.shoe.color)

app.use(express.raw());
// while sending raw data

app.use(express.text());
// while sending raw text data

app.use(express.static(path.join(__dirname, "/public")));
app.use("/static", express.static(path.join(__dirname, "/public")));
// to parse the static files to client, we can pass multiple static paths like this
// if we user logger after the static middleware logger won't log the static req
//app.use(logger());

// some variables
// equal to __dirname
console.log("process.cwd", process.cwd()); // F:\Mean Stack Projects\advanced_expressjs
//

/**
 * external middlewares in express
 */
// dotenv
const envVariables = dotenv.config({
  path: "./configurations.env",
  encoding: "latin1", // Default: utf8
  debug: process.env.DEBUG // Default: false
}); // specify custom name or path , Default : path.resolve(process.cwd(), ".env");
if (envVariables.error) {
  throw envVariables.error;
}
console.log(envVariables.parsed);
let buf = Buffer.from("BASIC=basic");
let opt = { debug: true }; // Default: false // expect a debug message because the buffer is not in KEY=VAL form
let config = dotenv.parse(buf, opt);
console.log(typeof config, config); // object { BASIC : 'basic' }

// http status codes
/*
www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
200- OK; Standard response for successful HTTP requests
201- Created; Request has been fulfilled. New resource created
204- No Content; Request processed. No content returned
301- Moved Permanently; This and all future requests directed to the given URI
304- Not Modified; Resource has not been modified since last requested
400- Bad Request; Request cannot be fulfilled due to bad syntax
401- Unauthorized; Authentication is possible, but has failed
403- Forbidden; Server refuses to respond to request
404- Not Found; Requested resource could not be found
500- Internal Server Error; Generic error message when server fails
501- Not Implemented; Server does not recognize method or lacks ability to fulfill
503- Service Unavailable; Server is currently unavailable
*/

// app properties in express
/*
    app.locals, app.mountpath
*/
// app local variables
app.locals.name = "sharath mohan";
app.locals.appName = "express app";
app.locals.settings.env = "production";

app.get("/appLocals", (req, res) => {
  req.app.locals, res.app.locals;
  // app.locals are available in req res cycle in req.app.locals, res.app.locals and app.locals
  res.send(app.locals);
});

// app mountpath and path
const subApp = express();
subApp.get("/", (req, res) => {
  res.write(subApp.mountpath); // mountpath is the path relative path of the current app mounted
  res.write("\n");
  res.write(subApp.path()); // path is the absolute or full path of the current app
  res.end();
});

// app.on("mount") is a app event in express
subApp.on("mount", function(parent) {
  // .on("mount") is a event calls when app mounted
  console.log("subApp Mounted");
});
app.use("/subApp", subApp);

const anotherSubApp = express();
anotherSubApp.get("/", (req, res) => {
  res.write(anotherSubApp.mountpath); // mountpath is the path relative path of the current app mounted
  res.write("\n");
  res.write(anotherSubApp.path()); // path is the absolute or full path of the current app
  res.end();
});

// app.on("mount") is a app event in express
anotherSubApp.on("mount", function(parent) {
  // .on("mount") is a event calls when app mounted
  console.log("anotherSubApp Mounted");
});
subApp.use("/anotherSubApp", anotherSubApp);

// app methods in express
app.enable("production"); // set the value production - true
app.disable("production"); // set the value production - false

app.enabled("production"); // checks the value production - boolean
app.disabled("production"); // checks the value production - boolean

// 500 or any error handling
if (process.env.NODE_ENV === "development") {
  app.use(function(err, req, res, next) {
    res
      .status(err.status || 500)
      .send({ status: 500, message: "internal error", type: "internal" });
    // next(err);
    // res.status(500);
    // res.end(500);
  });
}

// app methods in express
/*
    app.all(), app.delete(), app.disable(), app.disabled(), app.enable(), app.enabled(), 
    app.engine(), app.get(), app.get(), app.listen(), app.METHOD(), app.param(), app.path(), 
    app.post(), app.put(), app.render(), app.route(), app.set(), app.use()
*/

// router methods in express
/* 
    methods, checkout, copy, delete, get, head, lock, merge, mkactivity, 
    mkcol, move, m-search, notify, options, patch, post, purge, put, report, 
    search, subscribe, trace, unlock, unsubscribe
*/
let one = function(req, res, next) {
  // middleware 1
  res.locals.data = "middleware 1 \n"; // res locals works in req res cycle lifetime
  next();
};

let two = function(req, res, next) {
  // middleware 2
  res.locals.data += "middleware 2 \n"; // res locals works in req res cycle lifetime
  next();
};

app.all("*", [one, two], (req, res) => {
  // giving response
  res.send(res.locals.data); // res locals works in req res cycle lifetime
});

app.get(["/a", "/b", "/c"], (req, res) => {
  res.send("you hit a b c");
});

app.get("/aa*", (req, res) => {
  res.send("small");
});

// work with app.param()
/*
    if we have any params in our end point we can use app.param to perform operations on param
    and it runs only once even though the endpoint matches multiple time
    and we can customize the behaviour of app.param see link bellow
    https://expressjs.com/en/4x/api.html#app.param
*/
app.param("id", function(req, res, next, id) {
  console.log("CALLED ONLY ONCE " + id);
  next();
});

app.get("/user/:id", function(req, res, next) {
  console.log("although this matches");
  next();
});

app.get("/user/:id", function(req, res) {
  console.log("and this matches too");
  res.end();
});

// if we have multiple params then we can go like this
app.param(["id", "page"], function(req, res, next, value) {
  console.log("CALLED ONLY ONCE with", value);
  next();
});

app.get("/user/:id/:page", function(req, res, next) {
  console.log("although this matches");
  next();
});

app.get("/user/:id/:page", function(req, res) {
  console.log("and this matches too");
  res.end();
});

// and we can customize the behaviour of app.param see link bellow
app.param("id", function(req, res, next, val) {
  if (val === String(1337)) {
    next();
  } else {
    res.send("not found anything");
    //   next("route"); to move from the current router
  }
});

// route to trigger the capture
app.get("/user/:id", function(req, res) {
  res.send("OK");
});

// app.render()
/*
    express res.render() uses app.render() behind the scene
    for declare the empty variables like appname, name use app.locals.appname , app.locals.name
    we can solve error of some variable not existed while we tried to reder the page
*/
app.locals.appname = "";
app.locals.name = "";
app.footer = "";
app.get("/expressRender", (req, res) => {
  app.render(
    "index.ejs",
    {
      appName: "express app",
      name: "sharath mohan"
    },
    function(err, html) {
      res.send(html);
    }
  );
  //   res.render("index", {
  //     appName: "express app",
  //     name: "sharath mohan"
  //   }, (err, html) => {
  //        or else we can use callback to handle error
  //        if we use callback function express won't send files, we need to send them
  //        using res.send(html)
  //   });
  // while res.render it gives error in the absence of variables
  // use app.render if you want to handle the error at server side and dont want to send error to front end
});

// app.route
app
  .route("/expressRoute")
  .get((req, res) => {
    res.send("get");
  })
  .post((req, res) => {
    res.send("post");
  })
  .put((req, res) => {
    res.send("put");
  })
  .delete((req, res) => {
    res.send("delete");
  });

// app.use()
/*
    we can app.use() to use multiple middlewares and subapps
    we can mention the path to use those middlewares and subapp
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

let useApp = express();
useApp.on("mount", parent => {
  console.log("useApp mounted");
});

app.use("/useAppCheck", middleware1, [middleware2, middleware3], useApp);
app.get("/useAppCheck", (req, res) => {
  res.send("one app mounted now : " + useApp.mountpath);
});

app.get("/useAppCheck2", (req, res) => {
  res.send("hi"); // this router do not use above middlewares
});

// request properties in express
/* 
    req.app, req.baseUrl, req.body, req.cookies, req.fresh, req.hostname, req.ip, req.ips, 
    req.method, req.originalUrl, req.params, req.path, req.protocol, req.query, req.route, 
    req.secure, req.signedCookies, req.stale, req.subdomains, req.xhr
*/
app.use((req, res, next) => {
  next();
  console.log(req.route); // use it bellownext() right here
  // otherwise we wont get route information that matches in future
  console.dir(req.originalUrl); // '/users/list'
  console.dir(req.baseUrl); // '/users'
  console.dir(req.path); // '/list'
});

app.get("/expressReqProperties", (req, res) => {
  console.log(req.app); // req.app contains all the data of app we can use req.app.get("views")
  // and it is available to req res cycle
  console.log(req.baseUrl); // here base url of means before /expressProperties
  console.log(req.body); // here is the body payload
  console.log(req.cookies); // cookies
  console.log(req.fresh); // boolean value true , false
  console.log(req.hostname); // domain name or localhost
  console.log(req.ip); // ip of the client
  console.log(req.ips); // fi trust proxy is true, this property contains an array of IP addresses specified in the X-Forwarded-For request header
  console.log(req.method); // get, post
  console.log(req.originalUrl); // gives full path
  console.log(req.params); // params like path/:name here name is param
  // we can also use req.params[0] when we were having route path like wildcards "name/*/*"
  console.log(req.path); // gives the current path
  console.log(req.protocol); // http , https
  console.log(req.query); // query like ?name=sharath here name is query
  console.log(req.route); // Contains the currently-matched route - string
  console.log(req.secure); // boolean equivalent to req.protocol === 'https'
  console.log(req.signedCookies); // signedCookies only if there are any
  console.log(req.stale); // opposite to req.fresh - boolean value
  console.log(req.subdomains); // list out the subdomains
  console.log(req.xhr); // if it is ajax call - boolean value
  res.send("hello");
});

app.get("/pathOne", (req, res, next) => {
  res.send("pathOne");
});

app.get("/pathTwo", (req, res, next) => {
  res.send("pathTwo");
});

// request methods in express
/*
    req.accepts(), req.acceptsCharsets(), req.acceptsEncodings(), req.acceptsLanguages(), 
    req.get(), req.is(), req.param(), req.range()
*/
app.get("/expressReqMethods/:id", (req, res) => {
  console.log(req.accepts()); // content type supported by express
  console.log(req.acceptsCharsets()); // charsets supported by express
  console.log(req.acceptsEncodings()); // encoding supported by express
  console.log(req.acceptsLanguages()); // gives languages supported by express
  console.log(req.get("Content-Type")); // gives content type supported by express
  console.log(req.is("text")); // check if content type is 'test', 'html' , 'json'
  console.log(req.param("id")); // req.param() method have access to all different parameters like below
  // goes in the same order - (1)params , (2)body, (3)query - req.param() method is deprecated now
  console.log(req.range()); // not understood this research about this
  res.send("hello");
});

// response properties in express
/*
    res.app, res.headersSent, res.locals
*/
app.get("/expressResProperties", (req, res) => {
  console.log(res.app); // same as req.app conatins all the info about app
  // including app.locals object and more we can use res.app.get("views") and more
  // and it is available to req res cycle
  console.log(res.headersSent); // gives false
  console.log(res.locals); // maintains local values for req, res cycle
  // res.app.locals and res.locals are different each other
  console.log(res.headersSent); // gives true after we send the res - true , false
});

// response methods in express
/* 
    res.append(), res.attachment(), res.cookie(), res.clearCookie(), res.download(), 
    res.end(), res.format(), res.get(), res.json(), res.jsonp(), res.links(), res.location(), 
    res.redirect(), res.render(), res.send(), res.sendFile(), res.sendStatus(), res.set(), 
    res.status(), res.type(), res.vary()
*/
app.set("x-powered-by", false); // disabling 'x-powered-by:express'
app.get("/resAppend", (req, res) => {
  res.append("Content-Type", "text");
  res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
  res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
  res.append("x-powered-by", "restify"); // setting wrong value makes anonymous
  // Note: calling res.set() after res.append() will reset the previously-set header value.
  res.set("Set-Cookie", "HttpOnly");
  res.end();
});

app.get("/resSet", (req, res) => {
  res.set({
    "Content-Type": "text/plain",
    "Content-Length": "123",
    ETag: "12345"
  });
  console.log(res.get("Content-Type"));
  res.status(200).end();
});

app.get("/resAttachment", (req, res) => {
  res.attachment("./package.json"); // totally this will be automatically downloaded by the browser
  res.type("json"); // we can set the content type just like this, or we can set at header res.set()
  res.end();
});

app.get("/resCookie", (req, res) => {
  res.cookie("AuthorizationCookie", "1234567890"); // set the cookie
  res.clearCookie("AuthorizationCookie"); // remove the cookie
  res.end();
});

app.get("/resClearCookie", (req, res) => {
  res.cookie("name", "tobi", { path: "/admin" }); // set the cookie for path /admin
  res.clearCookie("name", { path: "/admin" }); // remove the cookie from path /admin
  res.end();
});

app.get("/resDownload", (req, res) => {
  res.download("package.json", err => {
    if (err) {
      // Handle error, but keep in mind the response may be partially-sent
      // so check res.headersSent
      res.status(404).end();
    } else {
      // decrement a download credit, etc.
    }
  });
});

// res.sendStatus(200) // equivalent to res.status(200).send('OK')
// res.sendStatus(403) // equivalent to res.status(403).send('Forbidden')
// res.sendStatus(404) // equivalent to res.status(404).send('Not Found')
// res.sendStatus(500) // equivalent to res.status(500).send('Internal Server Error')

// res.send(Buffer.from('whoop'))
// res.send({ some: 'json' })
// res.send('<p>some html</p>')
// res.status(404).send('Sorry, we cannot find that!')
// res.status(500).append("set-cookie", "cookie").type("json").send({ error: "something blew up" });

// res.redirect('http://example.com')
// res.redirect(301, 'http://example.com') // with status code if we use status code like this
//      then browser stops redirecting gives user option to click on redirection link
// res.redirect('../login')
// res.redirect('http://google.com')
// res.redirect('/admin')
// res.redirect('..') // redirects us to one step back
// res.redirect('back') // redirects us to previous path the path where we are from

app.get("/resLocation", (req, res) => {
  console.log(res.location("/"));
  res.end();
});

app.get("/resFormat", (req, res) => {
  // gives based on the req content type from client side
  // it selects which content type which data we need to send
  res.format({
    "text/plain": function() {
      res.send("hey");
    },

    "text/html": function() {
      res.send("<p>hello inside paragraph</p>");
    },

    "application/json": function() {
      res.send({ message: "hey" });
    },

    default: function() {
      // log the request and respond with 406
      res.status(406).send("Not Acceptable");
    }
  });
});

/**
 * configurable middleware
 */
let middleware /* module.exports */ = function(options) {
  return function(req, res, next) {
    // Implement the middleware function based on the options object
    let { option1, option2 } = options;
    next();
  };
};

// var mw = require('./my-middleware.js')
let mw = middleware;
app.use(mw({ option1: "1", option2: "2" }));

// listening on the port for the app
/* 
    app.listen(path, [callback]) // use path
    app.listen([port[, host[, backlog]]][, callback]) // use port number
    we can listen on multiple ports for multiple apps or paths and both HTTP, HTTPS
    we can pass app into http and https modules for listen - 
        http.createServer(app).listen(80)
        https.createServer(options, app).listen(443)
    visit this link - https://expressjs.com/en/4x/api.html#app.listen
*/
// listening for app instance
let appPort = process.env.APP_PORT;
app.listen(appPort, () => {
  console.log(`app running on port ${appPort}`);
});

// listening for admin instance
let subAppPort = process.env.SUBAPP_PORT;
subApp.listen(subAppPort, () => {
  console.log(`admin running on port ${subAppPort}`);
});

// listening for secret instance on /secret path
// secret.listen("/secret", () => {
//   console.log("admin is listening on /secret path");
// }); // it was denied the permission on windows right now

// debugging in express.js app
/**
 * set DEBUG environment variable to express:* then run the server
 * "debug": "set DEBUG=express:* & nodemon server.js"
 */

/**
 * // express security best practice
 * https://expressjs.com/en/advanced/best-practice-security.html
 */

/**
 * // express performance best practive
 * https://expressjs.com/en/advanced/best-practice-performance.html
 */
