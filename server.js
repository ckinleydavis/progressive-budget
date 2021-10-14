const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const timeout = require('connect-timeout')

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(timeout('10s'))

app.use(express.static("public"));

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});