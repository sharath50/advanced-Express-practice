const mongoose = require("mongoose");
require("dotenv").config({ path: "./configurations.env" });

// mongoDB connection
mongoose
  .connect(process.env.DB_HOST, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(status => {
    console.log("DB Connected");
  })
  .catch(err => {
    console.log(err);
  });

module.exports = mongoose;
