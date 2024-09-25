const jwt = require("jsonwebtoken");

const { JWT_USER_PASSWORD } = require("../config");

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
