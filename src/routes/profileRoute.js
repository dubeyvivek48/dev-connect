const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
profileRouter.get('/profile', userAuth, (req, res) => {
  try {
    res.status(200).send({ profile: req.user });
  } catch (err) {
    res.status(400).send('Something went wrong 😒..');
  }
});

module.exports = { profileRouter };
