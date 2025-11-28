const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateProfileUpdateData } = require('../utils/validation');
const { getAllowedData } = require('../utils/constants');

profileRouter.get('/profile/view', userAuth, (req, res) => {
  try {
    let profile = getAllowedData(req.user);

    res
      .status(200)
      .send({ data: profile, message: 'Profile fetched successfully' });
  } catch (err) {
    res.status(400).send({ ERROR: err.message || 'Something went wrong 😒..' });
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
    res
      .status(200)
      .send({ data: req.user, message: 'Profile sucessfully updated' });
  } catch (err) {
    res.status(400).send({ ERROR: err.message });
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
