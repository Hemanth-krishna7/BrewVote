const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the user casting the vote.']
    },
    coffee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coffee',
      required: [true, 'Please provide the coffee being voted on.']
    }
  },
  {
    timestamps: true
  }
);

// Indexes
// 1. Compound unique index: Prevents a user from voting on the same coffee multiple times
VoteSchema.index({ user: 1, coffee: 1 }, { unique: true });

// 2. Analytics index: Optimize queries for aggregates or counting votes per coffee variety
VoteSchema.index({ coffee: 1 });

module.exports = mongoose.model('Vote', VoteSchema);
