const express = require('express');
const app = express();
require('dotenv').config();
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
const { connectDB } = require('./config/database');
const { validateSignupData } = require('./utils/validation');

const User = require('./models/user');
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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
    res.status(201).send('User Added successfully!');
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res
        .status(401)
        .send('Authentication failed. The provided credentials are invalid.😒');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .send('Authentication failed. The provided credentials are invalid.😒');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('token', token, { httpOnly: true });
    res.send('Login successful😊');
  } catch (err) {
    res.status(400).send('Something went wrong ');
  }
});

app.get('/profile', async (req, res) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).send('Unauthorized access');
    }
    const userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send('Something went wrong ');
  }
});

// Get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    console.log(userEmail);
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send('Something went wrong ');
  }
});

// Feed API - GET /feed - get all the users from the database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send('Something went wrong ');
  }
});

// Detele a user from the database
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    //const user = await User.findByIdAndDelete(userId);

    res.send('User deleted successfully');
  } catch (err) {
    res.status(400).send('Something went wrong ');
  }
});

// Update data of the user
app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error('Update not allowed');
    }
    if (data?.skills.length > 10) {
      throw new Error('Skills cannot be more than 10');
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    console.log(user);
    res.send('User updated successfully');
  } catch (err) {
    res.status(400).send('UPDATE FAILED:' + err.message);
  }
});

connectDB()
  .then(() => {
    console.log('Connected to the database successfully');
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect ', err);
  });
