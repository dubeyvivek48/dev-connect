const { Schema, model } = require('mongoose');

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: ['ignored', 'intrested', 'accepted', 'rejected'],
      message: '{VALUE} is not supported',
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(new Error('Cannot send connection request to yourself'));
  }
  next();
});

module.exports = model('ConnectionRequest', connectionRequestSchema);
