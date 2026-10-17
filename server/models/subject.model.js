const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true, unique: true },
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  courseId: { type: String, required: true },
});

module.exports = mongoose.model('Subject', subjectSchema);