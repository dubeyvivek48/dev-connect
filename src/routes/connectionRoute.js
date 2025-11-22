const express = require('express');
const { authRoute } = require('./authRoute');
const user = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const connectionRoute = express.Router();

connectionRoute.post(
  '/connection/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user?._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatuses = ['ignored', 'intrested'];

      if (!allowedStatuses.includes(status)) {
        throw new Error('Invalid status value : ' + status);
      }

      const verifyToUserId = await user.findById(toUserId);

      if (!verifyToUserId) {
        return res
          .status(400)
          .send('The user you are trying to connect does not exist');
      }

      const verifyIfConnectionExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });

      if (verifyIfConnectionExists) {
        return res.status(400).send('Connection request already exists');
      }

      let connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      let data = await connectionRequest.save();
      res
        .status(201)
        .json({ message: 'Connection request sent successfully', data });
    } catch (err) {
      res.status(400).send('Something went wrong 😒..' + err);
    }
  }
);

connectionRoute.post(
  '/connection/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.user?._id;
      const { status, requestId } = req.params;

      const allowedStatuses = ['accepted', 'rejected'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).send('Invalid status value : ' + status);
      }
      const connectionRequest = await ConnectionRequest.findOne({
        toUserId,
        status: 'intrested',
        _id: requestId,
      });

      if (!connectionRequest) {
        return res.status(400).send('No connection request found');
      }

      connectionRequest.status = status;

      let data = await connectionRequest.save();
      res
        .status(200)
        .json({ message: 'Connection request reviewed successfully', data });
    } catch (err) {
      res.status(400).send('Something went wrong 😒..' + err);
    }
  }
);

module.exports = { connectionRoute };
