const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const userModel = require("../users");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Functions = require("../functions/function");
process.setMaxListeners(20);

async function getUserById(username) {
  try {
    const doc = await userModel
      .findOne({ username: username }, "_id")
      .lean()
      .exec();
    return doc._id;
  } catch (err) {
    throw err;
  }
}
function tokenAuthentication(req) {
  const accessToken = req.cookies.accessToken;
  if (req.cookies.accessToken == undefined)
    return res.status(401).send({ success: false, message: "token undefined" });
  const decoded = jwt.verify(accessToken, process.env.SECRET);
  let userId = decoded.userId;
  if (userId == undefined)
    res.status(401).send({ success: false, message: "userId undefined" });
  return userId;
}
module.exports = {
  getUserById: getUserById,
  tokenAuthentication: tokenAuthentication,
};
