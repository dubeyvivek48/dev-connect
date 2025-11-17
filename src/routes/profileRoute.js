const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateProfileUpdateData } = require('../utils/validation');

profileRouter.get('/profile/view', userAuth, (req, res) => {
  try {
    let profile = req.user;
    res.status(200).send({ profile });
  } catch (err) {
    res.status(400).send('Something went wrong 😒..');
  }
});
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  const updates = Object.keys(req.body);

  try {
    validateProfileUpdateData(req);
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.status(200).send({ profile: req.user });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch('/profile/passwordUpdate', userAuth, async (req, res) => {
  try {
    let user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).send('Password not matched 😒...');
    } else {
      await user.hashPassword(newPassword);
      user.save();
      res.status(200).send('Password updated successfully 😊');
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Something went wrong 😒..');
  }
});

module.exports = { profileRouter };
