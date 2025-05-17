import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logging from './logging.js';

dotenv.config();

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  logging.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logging.info('Connected to MongoDB successfully');

    // Configure mongoose settings
    mongoose.set('strictQuery', true);

    // Event listeners for connection monitoring
    mongoose.connection.on('error', (err) => {
      logging.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logging.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logging.info('MongoDB reconnected');
    });
  } catch (error) {
    logging.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logging.info('MongoDB connection closed successfully');
  } catch (error) {
    logging.error('Error closing MongoDB connection:', error);
  }
};
