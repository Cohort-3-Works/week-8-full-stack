const { Router } = require("express");
require("dotenv").config();
const { adminAuth } = require("../middleware/admin");
const { admin } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminRouter = Router();

adminRouter.post("/signup", async function (req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    const existingUser = await admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Admin already exists try using a different mail",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new admin({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newAdmin.save();

    return res.json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (err) {
    return res.json({
      message: "Something went wrong !!!",
    });
  }
});

adminRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }
    const existingUser = await admin.findOne({ email: email });

    if (!existingUser) {
      return res.status(400).json({
        message: "Admin does not exist",
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
      process.env.JWT_ADMIN_PASSWORD
    );

    return res.json({
      success: true,
      message: "signed in successfully",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong !!!",
    });
  }
});

adminRouter.post("/createcourse", adminAuth, async function (req, res) {
  try {
    const { title, description, price, imageUrl } = req.body;
    if (!title || !description || !price || !imageUrl) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }
    const newCourse = new course({
      title,
      description,
      price,
      imageUrl,
      creatorId: req.id,
    });

    await newCourse.save();

    return res.json({
      success: true,
      message: "Course created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong !!!",
    });
  }
});

adminRouter.put("/deletecourse", function (req, res) {
  res.json({
    message: "signup endpoint",
  });
});

adminRouter.get("/course/bulk", function (req, res) {
  res.json({
    message: "signup endpoint",
  });
});

module.exports = {
  adminRouter: adminRouter,
};
