const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

  if (decoded) {
    req.id = decoded.id;
    next();
  } else {
    res.status(401).json({
      message: "You are not signed up as an admin",
    });
  }
};

module.exports = {
  adminAuth,
};
