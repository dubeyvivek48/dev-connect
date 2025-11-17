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

function validateProfileUpdateData(req) {
  const allowedUpdates = ['age', 'skills', 'gender', 'photoUrl', 'about'];
  const updates = Object.keys(req.body);
  const data = req.body;
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    throw new Error(
      'Invalid updates! You can only update age, skills, and photoUrl.'
    );
  }
  if (data.age !== undefined && data.age < 18) {
    throw new Error('Age must be at least 18.');
  }
  if (data.photoUrl !== undefined && !validator.isURL(data.photoUrl)) {
    throw new Error('Invalid Photo URL.');
  }
  if (data.skills !== undefined && !Array.isArray(data.skills)) {
    throw new Error('Skills must be an array of strings.');
  }
}

module.exports = { validateSignupData, validateProfileUpdateData };
