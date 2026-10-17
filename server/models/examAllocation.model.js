const mongoose = require('mongoose');

const examAllocationSchema = new mongoose.Schema({
  examSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamSession',
    required: true
  },
  blockId: { type: String, required: true },
  room: { type: String, required: true },
  seat: { type: String, required: true },
  student: {
    type: String,
    ref: 'User',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  faculty: {
    type: String,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  }
}, { timestamps: true });

// Compound index to prevent duplicate allocations
examAllocationSchema.index(
    { 
      examSession: 1, 
      blockId: 1, 
      room: 1, 
      seat: 1 
    }, 
    { unique: true }
  );
  
  module.exports = mongoose.model('ExamAllocation', examAllocationSchema);