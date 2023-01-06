const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const userModel = require("../users");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const functions = require("../functions/function");
const { findById } = require("../users");
process.setMaxListeners(20);
router.use(cookieParser());
router.use(bodyParser.json());

///////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/login", async (req, res) => {
  const secret = process.env.SECRET;
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  const userData = { username: username, password: password };
  const user = await userModel.findOne({ username, password });
  if (!user)
    return res.status(401).send({ success: false, message: "user not found" });
  const userId = user._id;
  const accessToken = jwt.sign({ userId }, process.env.SECRET);
  if (!user) return res.status(401).send({});
  if (userData == {}) return res.status(401).send({ success: false });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });
  res.status(200).send({ success: true });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/Register", async (req, res) => {
  const userData = req.body;
  const username = req.body.username;
  const password = req.body.password;
  console.log(userData);
  if (await userModel.findOne({ username: username })) {
    console.log("User taken");
    return res.status(401).send({ success: false, message: "User taken" });
  }
  await userModel.create(userData);
  if (!userData) return res.status(401).send({ success: false });
  return res.status(200).send({ success: true });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/login/forgotPassword", async function getUserId(req, res) {
  const user = await userModel
    .findOne({
      username: req.body.username,
      securityQuestion: req.body.securityQuestion,
    })
    .select("password")
    .exec();
  if (user) {
    user.password = req.body.newPassword;
    await user.save();
    return res.status(200).send({ message: "password updated", success: true });
  } else {
    console.log(user);
    return res
      .status(401)
      .send({ message: "security question wrong", success: false });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
