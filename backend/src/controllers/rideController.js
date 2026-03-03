const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const Payment = require('../models/Payment');

const FARE_PER_KM = 15;
const BASE_FARE = 50;

const getPopulatedRideById = async (rideId) => {
  return Ride.findById(rideId)
    .populate('user', 'name email phone')
    .populate('driver')
    .populate('driver.user', 'name email phone');
};

exports.estimateFare = async (req, res, next) => {
  try {
    const { estimatedDistance } = req.query;
    const km = Math.max(0, parseFloat(estimatedDistance) || 5);
    const fare = Math.round(BASE_FARE + km * FARE_PER_KM);
    res.json({ success: true, data: { fare, estimatedDistance: km } });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { pickupLocation, dropLocation, fare, estimatedDistance } = req.body;
    if (!pickupLocation || !dropLocation || fare == null) {
      return res.status(400).json({
        success: false,
        message: 'Pickup location, drop location and fare are required.',
      });
    }

    const ride = await Ride.create({
      user: req.user.id,
      pickupLocation,
      dropLocation,
      fare: Number(fare),
      estimatedDistance: estimatedDistance ? Number(estimatedDistance) : null,
      status: 'requested',
    });

    const populatedRide = await getPopulatedRideById(ride._id);
    res.status(201).json({ success: true, data: populatedRide });
  } catch (err) {
    next(err);
  }
};

const PAID_STATUSES = ['paid', 'completed', 'success', 'succeeded'];

const attachPaidFlag = async (rides) => {
  const list = Array.isArray(rides) ? rides : [rides];
  const ids = list.filter(Boolean).map((r) => r._id);

  if (!ids.length) return Array.isArray(rides) ? [] : null;

  const paidRows = await Payment.find(
    { ride: { $in: ids }, status: { $in: PAID_STATUSES } },
    'ride status'
  ).lean();

  const paidSet = new Set(paidRows.map((p) => String(p.ride)));

  const mapped = list.map((r) => {
    const obj = typeof r.toObject === 'function' ? r.toObject() : r;
    return { ...obj, isPaid: paidSet.has(String(r._id)) };
  });

  return Array.isArray(rides) ? mapped : mapped[0];
};

exports.getMyRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .populate('driver')
      .populate('driver.user', 'name phone')
      .sort({ createdAt: -1 });

    const data = await attachPaidFlag(rides);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('driver')
      .populate('driver.user', 'name email phone');

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    const isUser = String(ride.user?._id) === String(req.user.id);
    const driverDoc = await Driver.findOne({ user: req.user.id });
    const isDriver = driverDoc && String(ride.driver?._id) === String(driverDoc._id);

    if (!isUser && !isDriver && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const data = await attachPaidFlag(ride);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver');
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    const { status } = req.body;
    const allowed = ['requested', 'accepted', 'pickup', 'ongoing', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    if (req.user.role === 'driver') {
      const driver = await Driver.findOne({ user: req.user.id });
      if (!driver) return res.status(404).json({ success: false, message: 'Driver profile not found.' });

      // allow claiming ride on accept
      if (status === 'accepted' && ride.status === 'requested') {
        ride.driver = driver._id;
      } else if (String(ride.driver?._id) !== String(driver._id)) {
        return res.status(403).json({ success: false, message: 'Not your ride.' });
      }
    }

    if (req.user.role === 'user') {
      const canCancel = status === 'cancelled' && ['requested', 'accepted'].includes(ride.status);
      if (!canCancel) {
        return res.status(403).json({ success: false, message: 'Action not allowed.' });
      }
    }

    ride.status = status;
    await ride.save();

    const populatedRide = await getPopulatedRideById(ride._id);
    return res.json({ success: true, data: populatedRide });
  } catch (err) {
    next(err);
  }
};

exports.acceptRide = async (req, res, next) => {
  try {
    const rideId = req.params.rideId || req.params.id;
    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found.' });

    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver profile not found.' });
    if (!driver.verified) {
      return res.status(403).json({ success: false, message: 'Driver not verified. Contact admin.' });
    }
    if (ride.status !== 'requested') {
      return res.status(400).json({ success: false, message: 'Ride no longer available.' });
    }

    ride.driver = driver._id;
    ride.status = 'accepted';
    await ride.save();

    const populatedRide = await getPopulatedRideById(ride._id);
    return res.status(200).json({
      success: true,
      message: 'Ride accepted successfully.',
      data: populatedRide,
    });
  } catch (err) {
    next(err);
  }
};

exports.pickupRide = async (req, res, next) => {
  try {
    const rideId = req.params.rideId || req.params.id;
    const ride = await Ride.findById(rideId).populate('driver');

    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found.' });

    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver profile not found.' });
    if (String(ride.driver?._id) !== String(driver._id)) {
      return res.status(403).json({ success: false, message: 'Not your ride.' });
    }

    ride.status = 'pickup';
    await ride.save();

    const populatedRide = await getPopulatedRideById(ride._id);
    return res.status(200).json({
      success: true,
      message: 'Ride picked up successfully.',
      data: populatedRide,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAvailableRides = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver profile not found.' });
    if (!driver.verified) return res.status(403).json({ success: false, message: 'Driver not verified.' });

    const rides = await Ride.find({ status: 'requested', driver: null })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: rides });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const rides = await Ride.find()
      .populate('user', 'name email phone')
      .populate('driver')
      .populate('driver.user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: rides });
  } catch (err) {
    next(err);
  }
};
