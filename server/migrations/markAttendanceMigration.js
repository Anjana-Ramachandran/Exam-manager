const mongoose = require('mongoose');
const ExamDetails = require('../models/exam.model');

async function markAttendanceMigration() {
  try {
    const updatedResult = await ExamDetails.updateMany(
      { attendance: 'Y', 'userId': { $regex: /^student/ } },
      { $set: { attendance: 'N' } }
    );
    console.log(`${updatedResult.nModified} attendance records reset to 'N'.`);
  } catch (err) {
    console.error('Error in markAttendanceMigration:', err.message);
  }
}

module.exports = markAttendanceMigration;
