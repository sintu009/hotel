import express from 'express';
import Event from '../models/Event.js';
import RoomType from '../models/RoomType.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Protect all routes
router.use(verifyToken);

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('roomType', 'name');
    
    // Format for frontend
    const formattedEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      date: event.date.toISOString().split('T')[0],
      startTime: event.startTime,
      endTime: event.endTime,
      type: 'event',
      roomType: event.roomType.name,
      description: event.description
    }));
    
    res.status(200).json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { title, description, date, roomTypeId, startTime, endTime } = req.body;
    
    // Verify room type exists
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    // Check for availability
    const eventDate = new Date(date);
    const existingEvent = await Event.findOne({
      date: {
        $gte: new Date(eventDate.setHours(0, 0, 0)),
        $lt: new Date(eventDate.setHours(23, 59, 59))
      },
      roomType: roomTypeId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });
    
    if (existingEvent) {
      return res.status(400).json({ message: 'This time slot is already booked for an event' });
    }
    
    // Create new event
    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      roomType: roomTypeId
    });
    
    await newEvent.save();
    
    res.status(201).json({
      id: newEvent._id,
      title: newEvent.title,
      date: newEvent.date.toISOString().split('T')[0],
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: 'event',
      roomType: roomType.name,
      description: newEvent.description
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('roomType', 'name');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({
      id: event._id,
      title: event.title,
      date: event.date.toISOString().split('T')[0],
      startTime: event.startTime,
      endTime: event.endTime,
      type: 'event',
      roomType: event.roomType.name,
      description: event.description
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, date, roomTypeId, startTime, endTime } = req.body;
    
    // Verify room type exists if provided
    if (roomTypeId) {
      const roomType = await RoomType.findById(roomTypeId);
      if (!roomType) {
        return res.status(404).json({ message: 'Room type not found' });
      }
    }
    
    // Find and update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date: new Date(date), startTime, endTime, roomType: roomTypeId },
      { new: true, runValidators: true }
    ).populate('roomType', 'name');
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({
      id: updatedEvent._id,
      title: updatedEvent.title,
      date: updatedEvent.date.toISOString().split('T')[0],
      startTime: updatedEvent.startTime,
      endTime: updatedEvent.endTime,
      type: 'event',
      roomType: updatedEvent.roomType.name,
      description: updatedEvent.description
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;