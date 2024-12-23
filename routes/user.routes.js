const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

if (!UserModel || !(UserModel.prototype instanceof mongoose.Model)) {
  throw new Error("UserModel is not a valid Mongoose model");
}

const router = express.Router();
router.use(cookie());
router.get("/register", (_, res) => {
  res.render("register");
});

router.get("/login", (_, res) => {
  res.render("login");
});

router.post(
  "/register",
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input data", errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        username,
        email,
        password: hashPassword,
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input data", errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(200)
        .json({ message: "username or password is incorrect" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res
        .status(200)
        .json({ message: "username or password is incorrect" });
    }

    const SECRET_KEY = process.env.JWT_SECRET || "some_random_secret_key";
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      SECRET_KEY
    );

    res.cookie("token", token);

    res.send("Logged in");
  }
);

module.exports = router;
