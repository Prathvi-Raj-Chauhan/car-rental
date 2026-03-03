const Car = require('../models/Car');
const path = require('path');

const buildFilter = (query) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = new RegExp(query.brand, 'i');
  if (query.minPrice != null || query.maxPrice != null) {
    filter.pricePerDay = {};
    if (query.minPrice != null) filter.pricePerDay.$gte = Number(query.minPrice);
    if (query.maxPrice != null) filter.pricePerDay.$lte = Number(query.maxPrice);
  }
  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, 'i') },
      { brand: new RegExp(query.search, 'i') },
      { model: new RegExp(query.search, 'i') },
    ];
  }
  if (query.availability) filter.availability = query.availability;
  return filter;
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);
    const cars = await Car.find(filter).populate('category', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: cars });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate('category', 'name description');
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    res.json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (req.file) body.image = '/uploads/cars/' + req.file.filename;
    const car = await Car.create(body);
    await car.populate('category', 'name');
    res.status(201).json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (req.file) body.image = '/uploads/cars/' + req.file.filename;
    const car = await Car.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    res.json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    res.json({ success: true, message: 'Car deleted.' });
  } catch (err) {
    next(err);
  }
};
