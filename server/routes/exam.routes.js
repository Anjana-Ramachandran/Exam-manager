const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');
const { authenticateToken, authorize } = require('../middleware/auth.middleware');

router.post(
  '/add-exam-details',
  authenticateToken,
  authorize(['Admin']),
  examController.addExamDetails
);

//to get exam time table data
router.get(
  '/get-exam-details/:userId/:block?/:room?',
  // authenticateToken,
  examController.getExamDetails
);

router.get(
  '/get-exam-count-details/:userId',
  examController.getExamCountDetails
);

router.post(
  '/mark-attendance',
  authenticateToken,
  authorize(['Faculty']),
  examController.markAttendance
);

router.post('/register-for-exam', examController.registerForExam);

router.post(
  '/get-exam-reg-details',
  examController.getExamRegistrationDetails
);

router.post(
  '/edit-exam-details',
  examController.editExamDetails
);
router.post(
  '/reg-exam-attendace',
  examController.addAttendance
);
router.post(
  '/feedback',
  authenticateToken,
  examController.submitFeedback
);

router.get(
  '/view-feedback',
  authenticateToken, // Ensure the user is authenticated
  authorize(['Admin']), // Only allow admins to access this route
  examController.viewFeedback
);
module.exports = router;