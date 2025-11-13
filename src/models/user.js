const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'First name must be at least 3 characters'],
    },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    age: { type: Number },
    skills: { type: [String], default: ['javascript'] },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    photoURL: {
      type: String,
      default:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fuser&psig=AOvVaw1IXIW8EEGLlaufyGTacJv5&ust=1763137784612000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJiZ_Z3G75ADFQAAAAAdAAAAABAE',
    },
  },
  { timestamps: true }
);
const UserModel = model(
  'User',
  //   userSchema
  userSchema.index({ email: 1 }, { unique: true })
);

module.exports = UserModel;
