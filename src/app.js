const express = require('express');
const app = express();
require('dotenv').config();
const { connectDB } = require('./config/database');
const UserModel = require('./models/user');
const port = 3000;

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const userObj = { firstName, lastName, email, password };

  const user = new UserModel(userObj);

  await user.save();
  res.send('User signed up successfully');
});

app.get('/users', async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
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
