const validator = require('validator');

function validateSignupData(req) {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || firstName.trim().length < 4 || firstName.length > 10) {
    throw new Error(
      'First name is required and must be between 4 and 10 characters without any spaces.'
    );
  }
  if (lastName.length > 10) {
    throw new Error('Last name must be between 4 and 10 characters.');
  }
  if (!validator.isEmail(emailId)) {
    throw new Error('Invalid email address');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password');
  }
}
module.exports = { validateSignupData };
