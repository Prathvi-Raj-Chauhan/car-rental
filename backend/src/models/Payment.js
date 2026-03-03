const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'cash', 'wallet'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ ride: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
