// import db from '../config/connection.js';
// import { Question } from '../models/index.js'
// import cleanDB from './cleanDb.js';

// import questionData from './pythonQuestions.json' assert{ type: 'json'};
// import fs from 'fs';
// import path from 'path';

// // Read JSON file manually
// const questionData = JSON.parse(
//   fs.readFileSync(path.resolve('./server/seeds/pythonQuestions.json'), 'utf-8')
// );
// try {
//   await db();
//   await cleanDB();

//   // bulk create each model
//   await Question.insertMany(questionData);

//   console.log('Seeding completed successfully!');
//   process.exit(0);
// } catch (error) {
//   console.error('Error seeding database:', error);
//   process.exit(1);
// }
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Question } from '../models/Question.js';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz';

const seedQuestions = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Load JSON data from file
    const filePath = path.resolve('src/seeds/pythonQuestions.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const questionData = JSON.parse(jsonData);

    // Clear existing data
    await Question.deleteMany({});
    console.log('Old questions removed');

    // Insert new questions
    await Question.insertMany(questionData);
    console.log('New questions seeded successfully!');

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedQuestions();
