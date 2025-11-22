const express = require('express');
const connectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const user = require('../models/user');

const populateOptions = [
  'firstName',
  'lastName',
  'emailId',
  'photoUrl',
  'about',
  'skills',
  'age',
  'gender',
];
const userRoute = express.Router();
userRoute.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const userId = req.user?._id;
    const receivedRequests = await connectionRequest
      .find({ toUserId: userId, status: 'intrested' })
      .populate('fromUserId', populateOptions);
    res.status(200).json({
      message: 'Received connection requests',
      count: receivedRequests.length,
      data: receivedRequests,
    });
  } catch (err) {
    res.status(400).send('Something went wrong 😒..' + err);
  }
});

userRoute.get('/user/connections', userAuth, async (req, res) => {
  try {
    const userId = req.user?._id;
    const connections = await connectionRequest
      .find({
        $or: [
          { fromUserId: userId, status: 'accepted' },
          { toUserId: userId, status: 'accepted' },
        ],
      })
      .populate('fromUserId', populateOptions)
      .populate('toUserId', populateOptions);
    const data = connections.map((connection) =>
      connection.fromUserId._id.toString() === userId.toString()
        ? connection.toUserId
        : connection.fromUserId
    );

    res
      .status(200)
      .json({ message: 'Connections fetched', count: data.length, data });
  } catch (err) {
    res.status(400).send('Something went wrong 😒..' + err);
  }
});

userRoute.get('/user/feed', userAuth, async (req, res) => {
  try {
    const userId = req.user?._id;
    // const { page = 1, limit = 1 } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const conncetions = await connectionRequest
      .find({
        $or: [{ fromUserId: userId }, { toUserId: userId }],
      })
      .select('fromUserId toUserId');

    const idSet = new Set();
    conncetions.forEach((connection) => {
      idSet.add(connection.fromUserId.toString());
      idSet.add(connection.toUserId.toString());
    });

    const filterCondition = {
      $and: [{ _id: { $ne: userId } }, { _id: { $nin: Array.from(idSet) } }],
    };
    const [users, count] = await Promise.all([
      user
        .find(filterCondition)
        .select(populateOptions)
        .skip((page - 1) * limit)
        .limit(limit),
      user.countDocuments(filterCondition),
    ]);

    res.status(200).json({ message: 'User feed fetched', count, users });
  } catch (err) {
    res.status(400).send('Something went wrong 😒..' + err);
  }
});

module.exports = { userRoute };
