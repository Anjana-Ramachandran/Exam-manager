const mongoose = require('mongoose');

const ExamTimetableSchema = new mongoose.Schema({
  examDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdBy: { type: String, required: true },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  courseId: { type: String, required: true },
  blockId: { type: String, required: true },
});

module.exports = mongoose.model('ExamTimetable', ExamTimetableSchema);
