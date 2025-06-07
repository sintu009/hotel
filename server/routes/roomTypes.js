import express from 'express';
import RoomType from '../models/RoomType.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Protect all routes
router.use(verifyToken);

// Get all room types
router.get('/', async (req, res) => {
  try {
    const roomTypes = await RoomType.find();
    res.status(200).json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new room type
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    
    // Check if room type already exists
    const existingRoomType = await RoomType.findOne({ name });
    if (existingRoomType) {
      return res.status(400).json({ message: 'Room type already exists' });
    }
    
    // Create new room type
    const newRoomType = new RoomType({
      name,
      description,
      price,
      image
    });
    
    await newRoomType.save();
    
    res.status(201).json(newRoomType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single room type
router.get('/:id', async (req, res) => {
  try {
    const roomType = await RoomType.findById(req.params.id);
    
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    res.status(200).json(roomType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a room type
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    
    // Find and update room type
    const updatedRoomType = await RoomType.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image },
      { new: true, runValidators: true }
    );
    
    if (!updatedRoomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    res.status(200).json(updatedRoomType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a room type
router.delete('/:id', async (req, res) => {
  try {
    const roomType = await RoomType.findByIdAndDelete(req.params.id);
    
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    res.status(200).json({ message: 'Room type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;