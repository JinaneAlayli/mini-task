const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // each browser/device will have its own sessionId
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
