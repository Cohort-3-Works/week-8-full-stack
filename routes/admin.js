const { Router } = require("express");
const { adminAuth } = require("../middleware/admin");
const JWT_ADMIN_PASSWORD = require("../config");
const bcrypt = require("bcrypt");
const adminRouter = Router();

adminRouter.post("/signup", async function (req, res) {
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
});

adminRouter.post("/signin", async function (req, res) {
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
    JWT_ADMIN_PASSWORD
  );

  return res.json({
    success: true,
    message: "signed in successfully",
    token,
  });
});

adminRouter.post("/createcourse", function (req, res) {
  res.json({
    message: "signup endpoint",
  });
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
