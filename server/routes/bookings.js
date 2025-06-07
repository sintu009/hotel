import express from 'express';
import Booking from '../models/Booking.js';
import RoomType from '../models/RoomType.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Protect all routes
router.use(verifyToken);

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('roomType', 'name');
    
    // Format for frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      title: `Booking by ${booking.name}`,
      date: booking.date.toISOString().split('T')[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      type: 'booking',
      roomType: booking.roomType.name,
      contact: booking.contactNumber
    }));
    
    res.status(200).json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { name, contactNumber, date, roomTypeId, startTime, endTime } = req.body;
    
    // Verify room type exists
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    // Check for availability
    const bookingDate = new Date(date);
    const existingBooking = await Booking.findOne({
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0)),
        $lt: new Date(bookingDate.setHours(23, 59, 59))
      },
      roomType: roomTypeId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    // Create new booking
    const newBooking = new Booking({
      name,
      contactNumber,
      date: new Date(date),
      startTime,
      endTime,
      roomType: roomTypeId
    });
    
    await newBooking.save();
    
    res.status(201).json({
      id: newBooking._id,
      title: `Booking by ${newBooking.name}`,
      date: newBooking.date.toISOString().split('T')[0],
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      type: 'booking',
      roomType: roomType.name,
      contact: newBooking.contactNumber
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('roomType', 'name');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json({
      id: booking._id,
      title: `Booking by ${booking.name}`,
      date: booking.date.toISOString().split('T')[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      type: 'booking',
      roomType: booking.roomType.name,
      contact: booking.contactNumber
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;