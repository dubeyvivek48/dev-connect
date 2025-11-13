const express = require('express');
const app = express();
require('dotenv').config();
const { connectDB } = require('./config/database');
const UserModel = require('./models/user');
const e = require('express');
const port = 3000;

app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userObj = { firstName, lastName, email, password };

    const user = new UserModel(userObj);

    await user.save();
    let data = await UserModel.find({});
    let response = {
      data,
      count: data.length,
    };
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send({ Error: err.message });
  }
});

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send({ Error: err.message });
  }
});

app.get('/feeds', async (req, res) => {
  try {
    const users = await UserModel.find({});
    if (users.length === 0) {
      return res.status(404).send('No users found');
    } else {
      res.send(users);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
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
