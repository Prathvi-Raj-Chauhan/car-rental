const mongoose = require('mongoose');

const RIDE_STATUS = ['requested', 'accepted', 'pickup', 'ongoing', 'completed', 'cancelled'];

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    dropLocation: {
      type: String,
      required: [true, 'Drop location is required'],
      trim: true,
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: RIDE_STATUS,
      default: 'requested',
    },
    estimatedDistance: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

rideSchema.index({ user: 1 });
rideSchema.index({ driver: 1 });
rideSchema.index({ status: 1 });

module.exports = mongoose.model('Ride', rideSchema);
