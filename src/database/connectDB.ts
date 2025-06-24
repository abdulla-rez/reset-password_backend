import { AppDataSource } from './data-source';

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Database connection error:', err);
  }
};
