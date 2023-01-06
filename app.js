require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const bodyParser = require("body-parser");
const userModel = require("./users.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = 3000;
const accountRouter = require("./routes/account");
const signInRouter = require("./routes/signIn");
app.use("/account", accountRouter);
app.use("/signIn", signInRouter);
app.use(cookieParser());
app.use(bodyParser.json());
mongoose.connect(
  "mongodb+srv://Ziv:Oriziv12@loginproject.rxuozld.mongodb.net/?retryWrites=true&w=majority",
  () => {
    console.log("connected");
  }
);
app.listen(port, () => {
  console.log("server is listening");
});
