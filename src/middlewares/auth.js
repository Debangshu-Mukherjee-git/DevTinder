const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the cookies
    const { token } = req.cookies;
    if(!token) {
        throw new Error("Token is not valid");
    }

    // validate the token
    const decoded = jwt.verify(token, "DEVTinder@123");
    const { _id } = decoded;

    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
};

module.exports = {
  userAuth,
};
