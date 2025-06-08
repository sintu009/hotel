import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingRoutes from './routes/bookings.js';
import eventRoutes from './routes/events.js';
import roomTypeRoutes from './routes/roomTypes.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';
import RoomType from './models/RoomType.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

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
          password: 'admin123'
        });
        console.log('Admin user created with username: admin, password: admin123');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }

    // Create sample room types if they don't exist
    try {
      const roomTypeCount = await RoomType.countDocuments();
      if (roomTypeCount === 0) {
        await RoomType.insertMany([
          {
            name: 'Conference Room',
            description: 'Perfect for meetings and presentations with full AV equipment.',
            price: 75,
            image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          },
          {
            name: 'Private Office',
            description: 'Quiet space for focused work or small team collaborations.',
            price: 45,
            image: 'https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          },
          {
            name: 'Event Space',
            description: 'Large open area for events, workshops, and social gatherings.',
            price: 120,
            image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }
        ]);
        console.log('Sample room types created');
      }
    } catch (error) {
      console.error('Error creating room types:', error);
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
  res.json({ message: 'Booking API is running', status: 'success' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});