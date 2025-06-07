import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: [true, 'Room type is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for title (used in frontend)
bookingSchema.virtual('title').get(function() {
  return `Booking by ${this.name}`;
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;