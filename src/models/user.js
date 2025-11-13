const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  age: { type: Number },
  gender: { type: String },
});
const UserModel = model('User', userSchema);

module.exports = UserModel;
