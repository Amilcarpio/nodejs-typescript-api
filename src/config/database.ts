import logging from './logging';
import fs from 'fs';
import path from 'path';
import { MongoDBAdapter } from './database/mongodb.adapter';
import { IDatabaseAdapter } from '../common/interfaces/database.interface';

const dbUri = process.env.MONGODB_URI || '';
export const dbAdapter: IDatabaseAdapter = new MongoDBAdapter(dbUri);

export const connectToDatabase = async (): Promise<void> => {
  try {
    await dbAdapter.connect();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mongoose = require('mongoose');
    const pingResult = await mongoose.connection.db.admin().ping();
    if (pingResult.ok === 1) {
      logging.log('MongoDB connection confirmed (ping ok)');
    } else {
      logging.warn('MongoDB ping did not return ok');
    }
  } catch (error) {
    logging.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await dbAdapter.disconnect();
  } catch (error) {
    logging.error('Error closing MongoDB connection:', error);
  }
};

export const migrateDatabase = async (): Promise<void> => {
  try {
    await dbAdapter.migrate();
    logging.log('Database migration completed successfully');
  } catch (error) {
    logging.error('Error during database migration:', error);
  }
};

function getAllModelFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllModelFiles(filePath));
    } else if (file.endsWith('.model.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

export const initializeModels = async (): Promise<void> => {
  try {
    const modelsDir = path.join(__dirname, '../modules');
    const modelFiles = getAllModelFiles(modelsDir);
    const loadedModels: string[] = [];
    for (const modelPath of modelFiles) {
      const imported = await import(modelPath);
      const schemaKey = Object.keys(imported).find((k) =>
        k.toLowerCase().includes('schema')
      );
      const modelName = path.basename(modelPath, '.model.ts');
      if (schemaKey && imported[schemaKey]) {
        await dbAdapter.initializeModels(modelName, imported[schemaKey]);
        loadedModels.push(modelName);
        logging.log(`Model ${modelName} initialized successfully`);
      } else {
        logging.warn(`No schema found in ${modelPath}`);
      }
    }
    logging.log('Schemas loaded: ' + loadedModels.join(', '));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mongoose = require('mongoose');
    logging.log('Models registered on database:');
    logging.log(Object.keys(mongoose.models));
  } catch (error) {
    logging.error('Error initializing models:', error);
  }
};
