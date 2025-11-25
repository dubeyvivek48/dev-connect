const express = require('express');
const bcrypt = require('bcrypt');
const { validateSignupData } = require('../utils/validation');
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');

const authRoute = express.Router();

authRoute.post('/signup', async (req, res) => {
  //   Creating a new instance of the User model

  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();

    const token = await user.getJWTToken();
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // must be false for localhost (HTTP)
      sameSite: 'lax', // should NOT be "none" for localhost
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).send('User Added successfully!');
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
  }
});

authRoute.post('/login', async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res
        .status(401)
        .send('Authentication failed. The provided credentials are invalid.😒');
    }

    const isPasswordMatch = await user.verifyPassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .send('Authentication failed. The provided credentials are invalid.😒');
    }
    const token = await user.getJWTToken();
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // must be false for localhost (HTTP)
      sameSite: 'lax', // should NOT be "none" for localhost
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send('Login successful😊');
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Something went wrong 😒..');
  }
});

authRoute.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });

  res.send(`Logout successfully 😊`);
});

module.exports = { authRoute };
