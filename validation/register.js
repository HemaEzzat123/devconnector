const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {}; // Initialize an empty object to store validation errors

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    // Check if the name length is between 2 and 30 characters
    errors.name = "Name must be between 2 and 30 characters";
  }

  // Check if the name field is empty and set an error message if it is
  data.name = !isEmpty(data.name) ? data.name : "";
  if (validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Check if the email field is empty and set an error message if it is
  data.email = !isEmpty(data.email) ? data.email : "";
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(data.email)) {
    // Check if the email format is valid and set an error message if it isn't
    errors.email = "Email is invalid";
  }

  // Check if the password field is empty and set an error message if it is
  data.password = !isEmpty(data.password) ? data.password : "";
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  // Check if the password2 field is empty and set an error message if it is
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  // Check if the password length is between 6 and 30 characters and set an error message if it isn't
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  // Check if the passwords match and set an error message if they don't
  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors), // Return true if there are no validation errors
  };
};
