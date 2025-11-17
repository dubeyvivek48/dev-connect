const User = require('../models/user');
var jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res.status(401).send('Unauthorized access');
    } else {
      const userId = jwt.verify(token, process.env.JWT_SECRET).userId;

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).send('User not found');
      } else {
        req.user = user;
        next();
      }
    }
  } catch (err) {
    res.status(400).send('Something went wrong--- 😒 ');
  }
};

module.exports = { userAuth };
