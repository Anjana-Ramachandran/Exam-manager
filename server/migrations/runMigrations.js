const mongoose = require('mongoose');
require('dotenv').config();
const createAccountsMigration = require('./createAccountsMigration');
const addExamDetailsMigration = require('./addExamDetailsMigration');
const markAttendanceMigration = require('./markAttendanceMigration');

const mongoUri = 'mongodb://127.0.0.1:27017/EMSdbTable';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4
})
.then(async () => {
  console.log('Connected to MongoDB successfully');
  try {
    await createAccountsMigration();
    await addExamDetailsMigration();
    await markAttendanceMigration();
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});