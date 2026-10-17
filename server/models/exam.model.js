const mongoose = require('mongoose');

const examDetailsSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  userId: { type: String, required: true },
  block: { type: String, required: true },
  room: { type: String, required: true },
  seat: { type: String, required: true },
  examDateTime: { type: Date, required: true },
  attendance: { type: String, enum: ['Y', 'N'], required: true },
});

module.exports = mongoose.model('ExamDetails', examDetailsSchema);