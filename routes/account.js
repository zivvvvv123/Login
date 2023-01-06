const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const userModel = require("../users");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { send } = require("process");
const functions = require("../functions/function");
process.setMaxListeners(20);
router.use(cookieParser());
router.use(bodyParser.json());
router.put("/ChangePassword", async (req, res) => {
  const secret = process.env.SECRET;
  const accessToken = req.cookies.accessToken;
  functions.tokenAuthentication(req);
  let userId = functions.tokenAuthentication(req);
  await userModel.findByIdAndUpdate(userId, { password: req.body.newPassword });
  res.status(200).send({ success: true });
});
router.put("/ChangeUsername", async (req, res) => {
  const secret = process.env.SECRET;
  const accessToken = req.cookies.accessToken;
  functions.tokenAuthentication(req);
  if (functions.tokenAuthentication(req) == undefined)
    return res.status(401).send({ message: "token undefined", success: false });
  let userId = functions.tokenAuthentication(req);
  if (await userModel.findOne({ username: req.body.newUsername }))
    return res.status(401).send({ message: "user taken", success: false });
  await userModel.findByIdAndUpdate(userId, { username: req.body.newUsername });
  return res.status(200).send({ success: true });
});
router.delete("/DeleteUser", async (req, res) => {
  let accessToken = req.cookies.accessToken;
  functions.tokenAuthentication(req);
  let userId = tokenAuthentication(req);
  await userModel.findByIdAndDelete(userId);
  accessToken = undefined;
  userId = undefined;
  res.clearCookie("accessToken");
  res.status(200).send({ success: true });
});
router.delete("/Logout", async (req, res) => {
  let accessToken = req.cookies.accessToken;
  functions.tokenAuthentication(req);
  let userId = functions.tokenAuthentication(req);
  accessToken = undefined;
  userId = undefined;
  res.clearCookie("accessToken");
  return res.status(200).send({ success: true });
});

module.exports = router;
