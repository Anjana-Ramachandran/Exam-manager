const ExamDetails = require('../models/exam.model');
const User = require('../models/user.model');
const ExamSession = require('../models/examSession.model');
const ExamAllocation = require('../models/examAllocation.model');
const SeatDetails = require('../models/seatDetails.model');
const Subject = require('../models/subject.model');
const moment = require('moment');
const ExamTimetable = require('../models/ExamTimetable');
const Feedback = require('../models/feedback.model');

// exports.registerForExam = async (req, res) => {
//   try {
//     const { userId, subjectCodes } = req.body; // Expecting an array of subjectCodes

//     // Validate inputs
//     if (!userId || !Array.isArray(subjectCodes) || subjectCodes.length === 0) {
//       return res.status(400).json({ message: 'userId and subjectCodes (array) are required.' });
//     }

//     // Find the user and verify role
//     const user = await User.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     if (user.role !== 'Student') {
//       return res.status(403).json({ message: 'Only students can register for exams.' });
//     }

//     let registrations = [];

//     for (const subjectCode of subjectCodes) {
//       // Find the exam timetable entry for the given subjectCode
//       const examTimetable = await ExamTimetable.findOne({ subjectCode });
//       if (!examTimetable) {
//         return res.status(404).json({ message: `Exam timetable not found for subjectCode: ${subjectCode}` });
//       }

//       // Find all available seats in the assigned block
//       const availableSeats = await SeatDetails.find({ blockId: examTimetable.blockId, isActive: 1 });

//       if (!availableSeats || availableSeats.length === 0) {
//         return res.status(404).json({ message: `No available seats for subjectCode: ${subjectCode}` });
//       }

//       // Select a random seat
//       const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];

//       // Assign the seat
//       await SeatDetails.findByIdAndUpdate(randomSeat._id, { isActive: 0, userId });

//       // Save the subject ObjectId in the user's subjects array
//       const subject = await Subject.findOne({ subjectCode });
//       if (!subject) {
//         return res.status(404).json({ message: `Subject not found for subjectCode: ${subjectCode}` });
//       }

//       if (!user.subjects.includes(subject._id)) {
//         user.subjects.push(subject._id);
//       }

//       // Prepare registration details
//       registrations.push({
//         userId: user.userId,
//         userName: user.userName,
//         subjectCode: examTimetable.subjectCode,
//         subjectName: examTimetable.subjectName,
//         semester: examTimetable.semester,
//         courseId: examTimetable.courseId,
//         examDate: examTimetable.examDate,
//         startTime: examTimetable.startTime,
//         endTime: examTimetable.endTime,
//         blockId: randomSeat.blockId,
//         room: randomSeat.room,
//         seat: randomSeat.seat,
//       });
//     }

//     // Save the updated user
//     await user.save();

//     return res.status(200).json({ message: 'Exam(s) registered successfully.', registrations });

//   } catch (error) {
//     console.error('Error registering for exam:', error);
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };
exports.registerForExam = async (req, res) => {
  try {
    const { userId, subjectCodes } = req.body; // Expecting an array of subjectCodes

    // Validate inputs
    if (!userId || !Array.isArray(subjectCodes) || subjectCodes.length === 0) {
      return res.status(400).json({ message: 'userId and subjectCodes (array) are required.' });
    }

    // Find the user and verify role
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
   

    if (user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can register for exams.' });
    }

    let registrations = [];
    
    

    // Keep track of block assignments per subject
    const subjectBlockMap = new Map();
    
    
    for (const subjectCode of subjectCodes) {
      // Find the exam timetable entry for the given subjectCode
      const examTimetable = await ExamTimetable.findOne({ subjectCode });
      if (!examTimetable) {
        return res.status(404).json({ message: `Exam timetable not found for subjectCode: ${subjectCode}` });
      }
      console.log("2",examTimetable)
      let selectedSeat;

      // Check if this subject already has students assigned to a block
      const existingSeat = await SeatDetails.findOne({ 
        blockId: examTimetable.blockId,
        isActive: 0,
        subjectCode: subjectCode
      });

      if (existingSeat) {
        // Find available seat in same block
        selectedSeat = await SeatDetails.findOne({
          blockId: existingSeat.blockId,
          isActive: 1
        });
      } else {
        // Find all available seats in the assigned block
        const availableSeats = await SeatDetails.find({ 
          blockId: examTimetable.blockId, 
          isActive: 1 
        });

        if (!availableSeats || availableSeats.length === 0) {
          return res.status(404).json({ message:` No available seats for subjectCode: ${subjectCode}` });
        }

        // Select a random seat
        selectedSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
      }

      if (!selectedSeat) {
        return res.status(404).json({ message: `No available seats in block for subjectCode: ${subjectCode}` });
      }

      // Assign the seat
      await SeatDetails.findByIdAndUpdate(selectedSeat._id, { 
        isActive: 0, 
        userId,
        subjectCode // Store subject code to track block assignments
      });

      // Save the subject ObjectId in the user's subjects array  
      const subject = await Subject.findOne({ subjectCode });
      if (!subject) {
        return res.status(404).json({ message: `Subject not found for subjectCode: ${subjectCode}` });
      }

      if (!user.subjects.includes(subject._id)) {
        user.subjects.push(subject._id);
      }

      // Prepare registration details
      registrations.push({
        userId: user.userId,
        userName: user.userName,
        subjectCode: examTimetable.subjectCode,
        subjectName: examTimetable.subjectName,
        semester: examTimetable.semester,
        courseId: examTimetable.courseId,
        examDate: examTimetable.examDate,
        startTime: examTimetable.startTime,
        endTime: examTimetable.endTime,
        blockId: selectedSeat.blockId,
        room: selectedSeat.room,
        seat: selectedSeat.seat,
      });
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Exam(s) registered successfully.', registrations });

  } catch (error) {
    console.error('Error registering for exam:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// Get Exam Registration Details Controller
exports.getExamRegistrationDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    // Find the user and get their role
    const user = await User.findOne({ userId }).populate('subjects');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'Admin') {
      return res.status(200).json({ message: 'Admin users do not have exam registration details.' });
    }

    if (user.role === 'Faculty') {
      return res.status(200).json({ message: 'Faculty users do not have exam registration details.' });
    }

    if (user.role === 'Student') {
      // For Student, get all subjects and their exam details
      const examDetails = [];

      for (const subject of user.subjects) {
        const examTimetable = await ExamTimetable.findOne({ subjectCode: subject.subjectCode });

        if (examTimetable) {
          const seat = await SeatDetails.findOne({ blockId: examTimetable.blockId, userId: userId });

          examDetails.push({
            subjectCode: examTimetable.subjectCode,
            subjectName: examTimetable.subjectName,
            semester: examTimetable.semester,
            courseId: examTimetable.courseId,
            examDate: examTimetable.examDate,
            startTime: examTimetable.startTime,
            endTime: examTimetable.endTime,
            blockId: seat ? seat.blockId : null,
            room: seat ? seat.room : null,
            seat: seat ? seat.seat : null,
          });
        }
      }

      return res.status(200).json({ message: 'Exam registration details fetched successfully.', examDetails });
    }

    return res.status(400).json({ message: 'Invalid user role.' });
  } catch (error) {
    console.error('Error fetching exam registration details:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Add exam details
exports.addExamDetails = async (req, res) => {
  try {
    const examDetails = req.body;

    if (!Array.isArray(examDetails) || examDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid payload: Expected an array of exam details' });
    }

    // Extract createdBy from the first record in the array
    const { createdBy } = examDetails[0];

    // Validate admin user
    const admin = await User.findOne({ userId: createdBy, role: 'Admin' });
    if (!admin) {
      return res.status(403).json({ error: 'Unauthorized: Only admin can create exam timetables' });
    }

    // Process each record in the array
    const records = await Promise.all(
      examDetails.map(async (exam) => {
        const { examDate, startTime, endTime, subjectCode, subjectName, semester, courseId, blockId } = exam;

        // Convert examDate to proper format
        const formattedExamDate = moment(examDate, 'DD-MM-YYYY').toDate();

        // Validate exam date
        if (formattedExamDate <= new Date()) {
          throw new Error(`Exam date must be in the future: ${examDate}`);
        }

        // Determine session
        const session = moment(startTime, 'hh:mm A').isBefore(moment('12:00 PM', 'hh:mm A'))
          ? 'MORNING'
          : 'EVENING';

        // Update if exists, otherwise insert new record
        return ExamTimetable.findOneAndUpdate(
          { subjectCode, examDate: formattedExamDate }, // Match existing record by subjectCode & examDate
          {
            startTime,
            endTime,
            session,
            createdBy,
            subjectCode,
            subjectName,
            semester,
            courseId,
            blockId
          },
          { upsert: true, new: true } // Insert if not exists, return updated doc
        );
      })
    );

    res.status(200).json({
      message: 'Exam timetable updated successfully',
      records,
    });
  } catch (error) {
    console.error('Error adding/updating exam timetable:', error);
    res.status(500).json({
      error: 'Error adding/updating exam timetable',
      message: error.message,
    });
  }
};


exports.editExamDetails = async (req, res) => {
  try {
    const examDetails = req.body;

    if (!Array.isArray(examDetails) || examDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid payload: Expected an array of exam details' });
    }

    const subjectCodesInPayload = examDetails.map(exam => exam.subjectCode);

    // Get all existing subjectCodes from the database
    const existingExams = await ExamTimetable.find({}, 'subjectCode');
    const existingSubjectCodes = existingExams.map(exam => exam.subjectCode);

    // Find subjectCodes to delete (present in DB but missing from payload)
    const subjectCodesToDelete = existingSubjectCodes.filter(code => !subjectCodesInPayload.includes(code));

    // Delete missing records
    if (subjectCodesToDelete.length > 0) {
      await ExamTimetable.deleteMany({ subjectCode: { $in: subjectCodesToDelete } });
      console.warn(`Deleted exams with subjectCodes: ${subjectCodesToDelete.join(', ')}`);
    }

    const updatedRecords = await Promise.all(
      examDetails.map(async (exam) => {
        const { subjectCode, examDate, startTime, endTime, subjectName, semester, courseId, blockId, createdBy } = exam;

        const formattedExamDate = moment.utc(examDate).startOf('day').toDate();

        // Check if subjectCode exists in DB
        let existingExam = await ExamTimetable.findOne({ subjectCode });

        if (!existingExam) {
          console.warn(`No exam found for subjectCode: ${subjectCode}, adding new record.`);

          // Create new record
          const newExam = new ExamTimetable({
            subjectCode,
            examDate: formattedExamDate,
            startTime,
            endTime,
            subjectName,
            semester,
            courseId,
            blockId,
            createdBy,
          });

          await newExam.save();
          return newExam;
        }

        // Update existing record
        return await ExamTimetable.findOneAndUpdate(
          { subjectCode },
          {
            examDate: formattedExamDate,
            startTime,
            endTime,
            subjectName,
            semester,
            courseId,
            blockId,
            createdBy,
          },
          { new: true } // Return updated document
        );
      })
    );

    res.status(200).json({
      message: 'Exam timetable updated successfully',
      updatedRecords,
      deletedRecords: subjectCodesToDelete, // Return deleted records for reference
    });
  } catch (error) {
    console.error('Error updating exam timetable:', error);
    res.status(500).json({
      error: 'Error updating exam timetable',
      message: error.message,
    });
  }
};


exports.addAttendance = async (req, res) => {
  try {
    const seatDetails = req.body;

    if (!Array.isArray(seatDetails) || seatDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid payload: Expected an array of seat details' });
    }

    const updatedRecords = await Promise.all(
      seatDetails.map(async (seatDetail) => {
        const { blockId, room, seat } = seatDetail;

        if (!blockId || !room || !seat) {
          console.warn(`Invalid record: Missing blockId, room, or seat in payload.`);
          return { blockId, room, seat, attendanceUpdated: false };
        }

        // Update attendance in SeatDetails table
        const attendanceUpdated = await SeatDetails.updateMany(
          {
            blockId: blockId,
            room: room,
            seat: seat
          },
          {
            attendance: true
          }
        );

        console.info(`Attendance updated for blockId: ${blockId}, room: ${room}, seat: ${seat}`);

        return {
          blockId,
          room,
          seat,
          attendanceUpdated: attendanceUpdated.modifiedCount > 0
        };
      })
    );

    res.status(200).json({
      message: 'Attendance updated successfully',
      updatedRecords
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      error: 'Error updating attendance',
      message: error.message,
    });
  }
};






// Get exam details
exports.getExamDetails = async (req, res) => {
  // const { userId, block, room } = req.params;
  
  // try {
  //   // Find the user to check their role
  //   const user = await User.findOne({ userId });
  //   if (!user) {
  //     return res.status(404).json({ error: 'User not found' });
  //   }

  //   let examDetails;
  //   let query = {};

  //   switch (user.role) {
  //     case 'Admin':
  //       // Admin can see all exam details
  //       examDetails = await ExamDetails.find({});
  //       break;

  //     case 'Student':
  //       // Students can only see their own exam details
  //       examDetails = await ExamDetails.find(
  //         { userId }, 
  //         'createdBy userId block room seat examDateTime'
  //       );
  //       break;

  //     case 'Faculty':
  //       // Faculty needs both block and room
  //       examDetails = await ExamDetails.find(
  //         { userId }, 
  //         'createdBy userId block room seat examDateTime'
  //       );
        
  //       break;

  //     default:
  //       return res.status(403).json({ error: 'Invalid user role' });
  //   }

  //   if (!examDetails || examDetails.length === 0) {
  //     return res.status(404).json({ 
  //       message: 'No exam details found for the given criteria' 
  //     });
  //   }

  //   res.status(200).json(examDetails);
  // } catch (error) {
  //   console.error('Get exam details error:', error);
  //   res.status(500).json({ error: 'Error fetching exam details' });
  // }
  try {
    const { examDate, subjectCode, semester, courseId, createdBy } = req.query;

    // Build the query object dynamically based on the provided filters
    const filter = {};
    if (examDate) {
      filter.examDate = moment(examDate, 'DD-MM-YYYY').toDate(); // Convert string date to Date object
    }
    if (subjectCode) {
      filter.subjectCode = subjectCode;
    }
    if (semester) {
      filter.semester = parseInt(semester, 10); // Convert semester to a number
    }
    if (courseId) {
      filter.courseId = courseId;
    }
    if (createdBy) {
      filter.createdBy = createdBy;
    }

    // Fetch the records based on filters
    const examTimetables = await ExamTimetable.find(filter);

    if (examTimetables.length === 0) {
      return res.status(404).json({ message: 'No exam timetables found for the given criteria' });
    }

    res.status(200).json({
      message: 'Exam timetables fetched successfully',
      records: examTimetables,
    });
  } catch (error) {
    console.error('Error fetching exam timetables:', error);
    res.status(500).json({
      error: 'Error fetching exam timetables',
      message: error.message,
    });
  }
};

exports.getExamCountDetails = async (req, res) =>{

  try {
    const { userId } = req.params;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    // Find the user and get their role
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // if (user.role !== 'Admin') {
    //   return res.status(403).json({ message: 'Access denied. Only Admin can view this data.' });
    // }

    // Fetch students registered for exams
    const students = await User.find({
      role: 'Student',
      subjects: { $exists: true, $ne: [] },
    }).select('userId userName subjects');

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found registered for exams.' });
    }

    // Map seat details and subjects for each student
    const results = await Promise.all(
      students.map(async (student) => {
        // Fetch seat details for the student (consider multiple seats)
        const seatDetails = await SeatDetails.find({ userId: student.userId });
    
        // Convert subject IDs to their respective details including courseId and semester
        const subjectsDetails = await Promise.all(
          student.subjects.map(async (subjectId) => {
            const subject = await Subject.findById(subjectId);
            if (subject) {
              return {
                subjectCode: subject.subjectCode,
                courseId: subject.courseId,
                semester: subject.semester,
              };
            }
            return null;
          })
        );
    
        // Remove null values (if any subject details are not found)
        const validSubjects = subjectsDetails.filter((subject) => subject);
    
        return {
          userId: student.userId,
          userName: student.userName,
          subjects: validSubjects,
          seats: seatDetails.map((seat) => ({
            blockId: seat.blockId,
            room: seat.room,
            seat: seat.seat,
          })),
        };
      })
    );    

    return res.status(200).json({
      message: 'Exam registration details fetched successfully.',
      data: results,
    });
  } catch (error) {
    console.error('Error fetching exam registration details:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
  
}

// Mark attendance
exports.markAttendance = async (req, res) => {
  const { userId, block, room, attendance } = req.body;

  try {
    // Verify the user is a faculty member
    const faculty = await User.findOne({ userId, role: 'Faculty' });
    if (!faculty) {
      return res.status(403).json({ 
        error: 'Only faculty members can mark attendance' 
      });
    }

    // Validate attendance data
    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid attendance data format' 
      });
    }

    // Update attendance for each student
    const updatePromises = attendance.map(async (record) => {
      const { userId: studentId, attendance: status } = record;

      if (!studentId || !status || !['Y', 'N'].includes(status)) {
        throw new Error(`Invalid attendance record for student ${studentId}`);
      }

      const examDetail = await ExamDetails.findOne({
        userId: studentId,
        block,
        room
      });

      if (!examDetail) {
        throw new Error(`No exam detail found for student ${studentId}`);
      }

      examDetail.attendance = status;
      return examDetail.save();
    });

    await Promise.all(updatePromises);

    res.status(200).json({ 
      message: 'Attendance marked successfully' 
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ 
      error: error.message || 'Error marking attendance' 
    });
  }
};
// Submit Feedback Controller
exports.submitFeedback = async (req, res) => {
  try {
    const { userId, feedback } = req.body;

    // Validate the request body
    if (!userId || !feedback) {
      return res.status(400).json({ message: 'userId and feedback are required' });
    }

    // Save feedback to the database
    const newFeedback = new Feedback({
      userId,
      feedback,
    });

    await newFeedback.save();

    // Send a success response
    res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
exports.viewFeedback = async (req, res) => {
  try {
    // Fetch all feedback from the database
    const feedback = await Feedback.find().sort({ createdAt: -1 }); // Sort by latest first

    // Send the feedback data as a response
    res.status(200).json({ message: 'Feedback fetched successfully', feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};