import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingRoutes from './routes/bookings.js';
import eventRoutes from './routes/events.js';
import roomTypeRoutes from './routes/roomTypes.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-app')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create admin user if it doesn't exist
    try {
      const adminExists = await User.findOne({ username: 'admin' });
      if (!adminExists) {
        await User.create({
          username: 'admin',
          password: 'admin@123'
        });
        console.log('Admin user created');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/room-types', roomTypeRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Booking API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});