import dotenv from 'dotenv';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
export const PORT = process.env.PORT || 3000;

export const server = {
  SERVER_HOSTNAME,
  PORT,
};
export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const DB_NAME = process.env.DB_NAME || 'ozmap';
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
export const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || 'BR';
