const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateLoginInput(data) {
  let errors = {}; // Initialize an empty object to store validation errors

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

  return {
    errors,
    isValid: isEmpty(errors), // Return true if there are no validation errors
  };
};
