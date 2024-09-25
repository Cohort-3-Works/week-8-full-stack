const jwt = require("jsonwebtoken");

require("dotenv").config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

const userAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, JWT_USER_PASSWORD);

  if (decoded) {
    req.id = decoded.id;
    next();
  } else {
    res.status(401).json({
      message: "You are not signed up as a user",
    });
  }
};

module.exports = {
  userAuth,
};
