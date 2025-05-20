import 'reflect-metadata';
import { config } from 'dotenv';
config({ path: '.env.test' });

import { dbAdapter } from '../../../config/database';

before(async () => {
  console.log('Connecting to MongoDB...');
  await dbAdapter.connect();
  console.log('MongoDB connected');
});

after(async () => {
  console.log('Closing MongoDB connection...');
  await dbAdapter.disconnect();
  console.log('MongoDB connection closed');
});
