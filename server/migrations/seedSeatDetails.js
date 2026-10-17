const mongoose = require('mongoose');
const SeatDetails = require('../models/seatDetails.model');

const generateSeatDetails = () => {
  const seatDetails = [];
  const blocks = ['JB', 'AC', 'AD'];  // 3 blocks
  const roomsPerBlock = 15;
  const seatsPerRoom = 25;  // 25 seats × 15 rooms × 3 blocks = 1125 seats

  blocks.forEach(block => {
    // Generate rooms (001-005 for ground floor, 101-105 for first floor, 201-205 for top floor)
    for (let floor = 0; floor <= 2; floor++) {
      for (let roomNum = 1; roomNum <= 5; roomNum++) {
        const room = `${block}${floor === 0 ? '0' : ''}${floor}0${roomNum}`; // Room numbers: 001, 002, ..., 101, 102, ..., 201, 202, ...
        
        // Generate seats for each room (e.g., JB001, JB002, JB003, etc.)
        for (let seatNum = 1; seatNum <= seatsPerRoom; seatNum++) {
          seatDetails.push({
            blockId: block,
            room: room,
            seat: `${block}${seatNum}`,
            isActive: 1,
            capacity: seatsPerRoom,
            // Adding metadata for better tracking
            floor: floor,
            seatType: seatNum % 2 === 0 ? 'WINDOW' : 'NORMAL',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }
  });

  return seatDetails;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB (update with your connection string)
    await mongoose.connect('mongodb://127.0.0.1:27017/EMSdbTable', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    });

    // Clear existing seat details
    await SeatDetails.deleteMany({});
    console.log('Cleared existing seat details');

    // Generate and insert new seat details
    const seatDetails = generateSeatDetails();
    await SeatDetails.insertMany(seatDetails);

    console.log('Successfully seeded seat details:');
    console.log(`Total blocks: 3`);
    console.log(`Total rooms: ${3 * 15}`);
    console.log(`Total seats: ${seatDetails.length}`);

    // Print some sample data
    const sampleData = await SeatDetails.find().limit(5);
    console.log('\nSample seat details:');
    console.log(sampleData);

    // Print summary by block
    const summary = await SeatDetails.aggregate([
      {
        $group: {
          _id: '$blockId',
          totalSeats: { $sum: 1 },
          rooms: { $addToSet: '$room' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nBlock-wise summary:');
    console.table(summary);

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

module.exports = { generateSeatDetails, seedDatabase };
