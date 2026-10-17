const mongoose = require('mongoose');
const Subject = require('../models/subject.model');  // Make sure to update the path if needed

const subjectDetails = [
  // English
  { subjectCode: 'ENG1A01', subjectName: 'TRANSACTIONS – ESSENTIAL ENGLISH LANGUAGE SKILLS', semester: 1, courseId: 'English' },
  { subjectCode: 'ENG1A02', subjectName: 'WAYS WITH WORDS – LITERATURES IN ENGLISH', semester: 1, courseId: 'English' },
  { subjectCode: 'ENG3A05', subjectName: 'SIGNATURES – EXPRESSING THE SELF', semester: 3, courseId: 'English' },
  { subjectCode: 'ENG3B03', subjectName: 'APPRECIATING PROSE', semester: 3, courseId: 'English' },
  { subjectCode: 'ENG5B08', subjectName: 'LITERARY THEORY', semester: 5, courseId: 'English' },
  { subjectCode: 'ENG5B10', subjectName: 'INDIAN WRITING IN ENGLISH', semester: 5, courseId: 'English' },
  // Commerce
  { subjectCode: 'BCM1B01', subjectName: 'Business Management', semester: 1, courseId: 'Commerce' },
  { subjectCode: 'BCM1C01', subjectName: 'Managerial Economics', semester: 1, courseId: 'Commerce' },
  { subjectCode: 'BCM3A11', subjectName: 'Basic Numerical Methods', semester: 3, courseId: 'Commerce' },
  { subjectCode: 'BCM3B03', subjectName: 'Business Regulations', semester: 3, courseId: 'Commerce' },
  { subjectCode: 'BCM5B10', subjectName: 'Course in Specialisation', semester: 5, courseId: 'Commerce' },
  { subjectCode: 'BCM5B07', subjectName: 'Accounting for Management', semester: 5, courseId: 'Commerce' },
  // Computer Application
  { subjectCode: 'BCA1B01', subjectName: 'Computer Fundamentals & HTML', semester: 1, courseId: 'Computer Application' },
  { subjectCode: 'BCA1C02', subjectName: 'Discrete Mathematics', semester: 1, courseId: 'Computer Application' },
  { subjectCode: 'BCA3B04', subjectName: 'Data Structures using C', semester: 3, courseId: 'Computer Application' },
  { subjectCode: 'BCA3C06', subjectName: 'Theory of Computation', semester: 3, courseId: 'Computer Application' },
  { subjectCode: 'BCA5B08', subjectName: 'Java Programming', semester: 5, courseId: 'Computer Application' },
  { subjectCode: 'BCA5B10', subjectName: 'Principles of Software Engineering', semester: 5, courseId: 'Computer Application' },
  // Management Studies
  { subjectCode: 'BBA1B01', subjectName: 'MANAGEMENT THEORY AND PRACTICES', semester: 1, courseId: 'Management Studies' },
  { subjectCode: 'BBA1C01', subjectName: 'Managerial Economics', semester: 1, courseId: 'Management Studies' },
  { subjectCode: 'BBA3A11', subjectName: 'Basic Numerical Methods', semester: 3, courseId: 'Management Studies' },
  { subjectCode: 'BBA3B04', subjectName: 'Corporate Accounting', semester: 3, courseId: 'Management Studies' },
  { subjectCode: 'BBA5B09', subjectName: 'Operations Management', semester: 5, courseId: 'Management Studies' },
  { subjectCode: 'BBA5B08', subjectName: 'Business Research Methods', semester: 5, courseId: 'Management Studies' },
  // Statistics
  { subjectCode: 'STA1C01', subjectName: 'Analytical Tools for Statistics – I', semester: 1, courseId: 'Statistics' },
  { subjectCode: 'STA1C03', subjectName: 'Distribution Theory', semester: 1, courseId: 'Statistics' },
  { subjectCode: 'STA3C11', subjectName: 'Applied Regression Analysis', semester: 3, courseId: 'Statistics' },
  { subjectCode: 'STA3C12', subjectName: 'Stochastic Processes', semester: 3, courseId: 'Statistics' },
  { subjectCode: 'STA5B06', subjectName: 'SAMPLE SURVEYS', semester: 5, courseId: 'Statistics' },
  { subjectCode: 'STA5D01', subjectName: 'ECONOMIC STATISTICS', semester: 5, courseId: 'Statistics' },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB (update with your connection string)
    await mongoose.connect('mongodb://127.0.0.1:27017/EMSdbTable', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    });

    // Clear existing subject details
    await Subject.deleteMany({});
    console.log('Cleared existing subject details');

    // Insert new subject details
    await Subject.insertMany(subjectDetails);

    console.log('Successfully seeded subject details');
    // Print some sample data
    const sampleData = await Subject.find().limit(5);
    console.log('\nSample subject details:');
    console.log(sampleData);

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Add command line arguments support
const args = process.argv.slice(2);
if (args.includes('--execute')) {
  seedDatabase().then(() => {
    console.log('Seeding completed');
    process.exit(0);
  });
}

module.exports = { seedDatabase };
