const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10; // the more greater, the more it longs
const { generateAccessToken } = require("../config/token");
const { default: mongoose } = require("mongoose");

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, loginUser.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    const newToken = generateAccessToken(loginUser.email); // regenerate token
    const updatedUser = await User.findOneAndUpdate(
      { _id: loginUser._id },
      { token: newToken },
      { new: true }
    );
    res.status(200).json({
      message: "Login success",
      data: { user: updatedUser, token: newToken },
    });
  } catch (err) {
    const error = new Error(err);
    error.message = "Can't login account";
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!name || !email || !password) {
      return res
        .status(422)
        .json({ message: "Name, email and password are required!" });
    }
    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return res.status(400).json({ message: "User already exists" });
      }
    } catch (error) {
      return next(err);
    }
    // hash password
    const hashedPasswrod = await bcrypt.hash(password, saltRounds);
    const token = generateAccessToken(email); // generate token
    const userData = {
      name,
      email,
      password: hashedPasswrod,
      token: token,
    };
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPasswrod,
      token: token,
    });
    res.status(201).json({
      message: "Register success",
      data: { user: user, token: user.token },
    });
  } catch (err) {
    const error = new Error(err);
    error.message = "Can't create account";
    return next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const currentUser = await User.findById(
      new mongoose.Types.ObjectId(userId)
    );
    if (!currentUser) {
      return res.status(404).json({ message: "Invalid user" });
    }
    // regenerate token
    const newToken = generateAccessToken(currentUser.email);
    await User.findByIdAndUpdate(
      currentUser._id,
      { token: newToken },
      { new: true }
    );
    res.status(200).json({ message: "Logout success" });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  login,
  register,
  logout,
};
