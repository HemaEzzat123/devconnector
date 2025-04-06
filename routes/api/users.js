const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");
const User = require("../../models/User");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users works" });
});

// @route   GET api/users/register
// @desc    Registers a user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors); // Return validation errors if any
  }
  // Destructure the request body
  const { name, email, password } = req.body;

  // Check if user already exists
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.email = "Email already exists"; // Set error message if user exists
      return res.status(400).json(errors); // Return error response
    } else {
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        name,
        email,
        password,
        avatar,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash; // Hash the password before saving
          newUser.save().then((user) => res.json(user)); // Save the user to the database
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Logs in user and returns JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors); // Return validation errors if any
  }

  // Destructure the request body
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // Check if user exists
  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = "User not found"; // Set error message if user does not exist
      return res.status(404).json(errors); // Return error response
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        errors.password = "Invalid credentials"; // Set error message if password is incorrect
        return res.status(400).json(errors); // Return error response
      }
      // Return JWT token
      const payload = { id: user.id, name: user.name, avatar: user.avatar };
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token,
        });
      });
    });
  });
});

// @route   GET api/users/current
// @desc    Returns current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    });
  }
);

module.exports = router;
