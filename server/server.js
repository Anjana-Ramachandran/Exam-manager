require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const examRoutes = require('./routes/exam.routes');
const User = require('./models/user.model')

const app = express();
// async function migrateStuSubjects() {
//   try {
//     const result = await User.updateMany(
//       { role: 'Student' }, 
//       { $set: { subjects: [] } }
//     );
    
//     console.log(`Updated ${result.modifiedCount} student records`);
//   } catch (error) {
//     console.error('Migration failed:', error);
//   }
// }

// // Call the migration function
// migrateStuSubjects();

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  });

// Or alternatively, using event listeners
// const db = mongoose.connection;
// db.on('error', (error) => {
//   console.error('MongoDB connection error:', error);
//   process.exit(1);
// });
// db.once('open', () => {
//   console.log('Connected to MongoDB successfully');
// });

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', examRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
