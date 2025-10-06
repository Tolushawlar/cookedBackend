import mongoose from 'mongoose';
import { IdeaModel } from '../models/Idea';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cooked-business';

console.log('Connecting to MongoDB:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB database');
    await initSampleData();
  } catch (error) {
    console.error('Error connecting to database:', error);
    console.log('Server will continue without database connection');
  }
};

const initSampleData = async () => {
  try {
    const count = await IdeaModel.countDocuments();
    if (count === 0) {
      const sampleIdeas = [
        {
          title: 'AI that cooks your meals',
          description: 'Smart kitchen AI that learns your preferences and cooks personalized meals automatically.',
          tag: 'AI',
          votes: 120,
          comments: 8
        },
        {
          title: 'Uber for pencils',
          description: 'On-demand pencil delivery service for students and professionals who always lose their writing tools.',
          tag: 'SaaS',
          votes: 14,
          comments: 3
        },
        {
          title: 'Crypto fridge that mines coins',
          description: 'Smart refrigerator that uses excess cooling power to mine cryptocurrency while keeping your food fresh.',
          tag: 'Crypto',
          votes: 65,
          comments: 12
        }
      ];

      await IdeaModel.insertMany(sampleIdeas);
      console.log('📝 Sample data inserted');
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};