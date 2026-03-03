const Booking = require('../models/Booking');
const Car = require('../models/Car');

const toLocalDateOnly = (value) => {
  if (!value) return null;

  // Handles "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss..."
  if (typeof value === "string") {
    const ymd = value.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
      const [y, m, d] = ymd.split("-").map(Number);
      return new Date(y, m - 1, d); // local date, no timezone shift
    }
  }

  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

const getDays = (start, end) => Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) || 1;

exports.create = async (req, res, next) => {
  try {
    const { carId, startDate, endDate } = req.body;
    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Car, start date and end date are required.' });
    }
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    if (car.availability !== 'available') {
      return res.status(400).json({ success: false, message: 'Car is not available for rent.' });
    }
    const startRaw =
      req.body.startDate ??
      req.body.fromDate ??
      req.body.pickupDate ??
      req.body.bookingDate ??
      req.body.rentFrom;

    const endRaw =
      req.body.endDate ??
      req.body.toDate ??
      req.body.dropDate ??
      req.body.returnDate ??
      req.body.rentTo;

    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (startRaw) {
      const startOnly = toLocalDateOnly(startRaw);
      if (!startOnly) {
        return res.status(400).json({ message: "Invalid start date." });
      }
      if (startOnly < todayOnly) {
        return res.status(400).json({ message: "Start date cannot be in the past." });
      }

      if (endRaw) {
        const endOnly = toLocalDateOnly(endRaw);
        if (!endOnly) {
          return res.status(400).json({ message: "Invalid end date." });
        }
        if (endOnly < startOnly) {
          return res.status(400).json({ message: "End date cannot be before start date." });
        }
      }
    }

    const days = getDays(startDate, endDate);
    if (days < 1) {
      return res.status(400).json({ success: false, message: 'End date must be after start date.' });
    }
    const totalPrice = days * car.pricePerDay;
    const booking = await Booking.create({
      user: req.user.id,
      car: carId,
      startDate,
      endDate,
      totalPrice,
    });
    await booking.populate(['car', 'user']);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car').populate('user', 'name email phone');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    if (req.user.role !== 'admin' && String(booking.user._id) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    if (String(booking.user) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own booking.' });
    }
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Booking cannot be cancelled.' });
    }
    booking.status = 'cancelled';
    await booking.save();
    await booking.populate('car');
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('car')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('car').populate('user', 'name email phone');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};
