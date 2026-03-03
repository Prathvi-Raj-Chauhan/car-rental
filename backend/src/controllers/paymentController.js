const Payment = require('../models/Payment');
const Ride = require('../models/Ride');

exports.create = async (req, res, next) => {
  try {
    const { rideId, amount, method, transactionId } = req.body;
    if (!rideId || amount == null || !method) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID, amount and payment method are required.',
      });
    }
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }
    if (String(ride.user) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not your ride.' });
    }
    if (ride.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Payment only for completed rides.' });
    }
    const existing = await Payment.findOne({ ride: rideId, status: 'completed' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Payment already done for this ride.' });
    }
    const payment = await Payment.create({
      ride: rideId,
      amount: Number(amount),
      method,
      transactionId: transactionId || undefined,
      status: 'completed',
    });
    await payment.populate('ride');
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

exports.getReceipt = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('ride')
      .populate('ride.user', 'name email phone')
      .populate('ride.driver')
      .populate('ride.driver.user', 'name phone');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }
    if (String(payment.ride.user._id) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

exports.getMyPayments = async (req, res, next) => {
  try {
    const Ride = require('../models/Ride');
    const myRides = await Ride.find({ user: req.user.id }).select('_id');
    const rideIds = myRides.map((r) => r._id);
    const payments = await Payment.find({ ride: { $in: rideIds } })
      .populate('ride')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('ride')
      .populate('ride.user', 'name email')
      .populate('ride.driver')
      .populate('ride.driver.user', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};
