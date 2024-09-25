const jwt = require("jsonwebtoken");

const { JWT_ADMIN_PASSWORD } = require("../config");

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
