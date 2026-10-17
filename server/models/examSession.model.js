const mongoose = require('mongoose');

const examSessionSchema = new mongoose.Schema({
  examDate: { type: Date, required: true },
  session: { type: String, enum: ['MORNING', 'EVENING'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  createdBy: { 
    type: String,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('ExamSession', examSessionSchema);