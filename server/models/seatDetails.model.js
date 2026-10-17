const mongoose = require('mongoose');

const seatDetailsSchema = new mongoose.Schema({
  blockId: { type: String, required: true },
  room: { type: String, required: true },
  seat: { type: String, required: true },
  isActive: { type: Number, default: 1 },  // 1: available, 0: unavailable
  capacity: { type: Number, required: true },
  userId: { type: String, required: false },
  attendance: { type: Boolean, required: false },
}, { timestamps: true });

// Compound index for unique block-room-seat combination
seatDetailsSchema.index({ blockId: 1, room: 1, seat: 1 }, { unique: true });

module.exports = mongoose.model('SeatDetails', seatDetailsSchema);