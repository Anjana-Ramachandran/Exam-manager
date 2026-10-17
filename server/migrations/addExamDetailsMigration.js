const mongoose = require('mongoose');
const ExamDetails = require('../models/exam.model');

async function addExamDetailsMigration() {
  // Define the exam details structure
  const examDetailsArray = [];

  // Admin exam details
  examDetailsArray.push({
    createdBy: 'admin1',
    userId: 'admin1',
    block: 'A',
    room: 'Room-Admin',
    seat: 'Seat-Admin',
    examDateTime: new Date(),
    attendance: 'N'
  });

  // Faculty exam details
  ['faculty1', 'faculty2'].forEach((facultyId, index) => {
    examDetailsArray.push({
      createdBy: 'admin1',
      userId: facultyId,
      block: index === 0 ? 'A' : 'B',
      room: `Room-${index + 1}`,
      seat: 'Seat-Faculty',
      examDateTime: new Date(),
      attendance: 'N'
    });
  });

  // Student exam details
  for (let i = 1; i <= 12; i++) {
    const block = i <= 6 ? 'A' : 'B';
    const roomNumber = i <= 6 ? 1 : 2;
    const seatNumber = i <= 6 ? i : (i - 6);

    examDetailsArray.push({
      createdBy: 'admin1',
      userId: `student${i}`,
      block: block,
      room: `Room-${roomNumber}`,
      seat: `Seat-${seatNumber}`,
      examDateTime: new Date(),
      attendance: 'N'
    });
  }

  try {
    await ExamDetails.insertMany(examDetailsArray);
    console.log('Exam details migration completed successfully!');
    console.log(`Created ${examDetailsArray.length} exam detail records`);
  } catch (err) {
    console.error('Error in addExamDetailsMigration:', err.message);
    throw err; // Propagate the error for better error handling
  }
}

module.exports = addExamDetailsMigration;