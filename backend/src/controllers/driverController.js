const Driver = require('../models/Driver');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, licenseNumber, vehicleType, vehicleNumber } = req.body;
    if (!name || !email || !password || !licenseNumber || !vehicleType || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, license number, vehicle type and vehicle number are required.',
      });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || undefined,
      role: 'driver',
    });
    const driver = await Driver.create({
      user: user._id,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      verified: false,
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      driver: {
        id: driver._id,
        verified: driver.verified,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id }).populate('user', 'name email phone');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found.' });
    }
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
};

exports.getMyRides = async (req, res, next) => {
  try {
    const Ride = require('../models/Ride');
    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver profile not found.' });
    const rides = await Ride.find({ driver: driver._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: rides });
  } catch (err) {
    next(err);
  }
};

exports.getAvailableRides = async (req, res, next) => {
  try {
    const Ride = require('../models/Ride');
    const driver = await Driver.findOne({ user: req.user.id });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver profile not found.' });
    if (!driver.verified) {
      return res.status(403).json({ success: false, message: 'Driver not verified.' });
    }
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
    const drivers = await Driver.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: drivers });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    ).populate('user', 'name email phone');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found.' });
    }
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { verified: false },
      { new: true }
    ).populate('user', 'name email phone');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found.' });
    }
    res.json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
};
