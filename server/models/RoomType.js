import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room type name is required'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);

export default RoomType;