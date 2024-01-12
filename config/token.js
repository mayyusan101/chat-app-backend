const jwt = require("jsonwebtoken");

function generateAccessToken(param) {
  return jwt.sign({ data: param }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
}

module.exports = {
  generateAccessToken,
};
