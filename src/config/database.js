const mongoose = require('mongoose');
const user = require('../models/user');

const connectDB = async () => {
  await mongoose.connect(process.env.DB_URL);
};

module.exports = { connectDB };
