const express = require('express');
const app = express();
require('dotenv').config();
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');

const { connectDB } = require('./config/database');
const { validateSignupData } = require('./utils/validation');

const User = require('./models/user');
const { userAuth } = require('./middlewares/auth');
const { authRoute } = require('./routes/authRoute');
const { profileRouter } = require('./routes/profileRoute');
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/', authRoute);
app.use('/', profileRouter);

// Get user by email
// app.get('/user', async (req, res) => {
//   const userEmail = req.body.emailId;

//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (!user) {
//       res.status(404).send('User not found');
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send('Something went wrong 😒 ');
//   }
// });

// Feed API - GET /feed - get all the users from the database
// app.get('/feed', async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send('Something went wrong 😒 ');
//   }
// });

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
