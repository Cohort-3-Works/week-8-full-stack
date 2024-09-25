const { Router } = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { user } = require("../db.js");
const { userAuth } = require("../middleware/user.js");
const jwt = require("jsonwebtoken");

const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newUser.save();

    return res.json({
      message: "signed up successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Something went wrong !!!",
    });
  }
});

userRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    const existingUser = await user.findOne({ email: email });

    if (!existingUser) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      },
      process.env.JWT_USER_PASSWORD
    );

    return res.json({
      message: "signed in successfully",
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Something went wrong !!!",
    });
  }
});

userRouter.get("allcourse", async function (req, res) {
  res.json({
    message: "all courses mentioned here ",
  });
});

userRouter.get("purchase", userAuth, async function (req, res) {
  res.json({
    message: "You are purchasing the course",
  });
});

userRouter.get("/purchases", userAuth, async function (req, res) {
  res.json({
    message: "All the purchased courses",
  });
});

module.exports = {
  userRouter: userRouter,
};
