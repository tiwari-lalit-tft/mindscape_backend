const jwt = require("jsonwebtoken");

function createVerificationToken(payload) {
  return jwt.sign(payload, process.env.TOKEN_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
}


function isProdServer() {
  process.env.PROD_SERVER === "true";
}

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};


module.exports = {
  createVerificationToken,
  isProdServer,
  validateEmail
}