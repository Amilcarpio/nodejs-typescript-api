import mongoose, { Schema, Model } from 'mongoose';
import logging from '../logging';
import { injectable } from 'tsyringe';
import { IDatabaseAdapter } from '../../common/interfaces/database.interface';

/**
 * MongoDB adapter using Mongoose for database operations.
 * Handles connection, model registration, and migration logic.
 */
@injectable()
export class MongoDBAdapter implements IDatabaseAdapter {
  private isConnectedFlag = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private models: Map<string, Model<any>> = new Map();
  constructor(private uri: string) {}
  model(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      this.isConnectedFlag = true;
      logging.log('Connected to MongoDB successfully');

      mongoose.set('strictQuery', true);

      mongoose.connection.on('error', (err) => {
        logging.error('MongoDB connection error:', err);
        this.isConnectedFlag = false;
      });

      mongoose.connection.on('disconnected', () => {
        logging.warn('MongoDB disconnected');
        this.isConnectedFlag = false;
      });

      mongoose.connection.on('reconnected', () => {
        logging.log('MongoDB reconnected');
        this.isConnectedFlag = true;
      });
    } catch (error) {
      this.isConnectedFlag = false;
      logging.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      this.isConnectedFlag = false;
      logging.info('MongoDB connection closed successfully');
    } catch (error) {
      logging.error('Error closing MongoDB connection:', error);
      throw error;
    }
  }

  async initializeModels(
    modelName: string,
    modelSchema: unknown
  ): Promise<void> {
    if (!this.isConnectedFlag) {
      throw new Error('Cannot initialize models: Database not connected');
    }
    logging.log('----------------------------------------');
    logging.log('Synchronizing models with database');
    logging.log('----------------------------------------');

    const model = this.createSchema(modelName, modelSchema as Schema);
    if (!model) {
      logging.error(`Failed to create model: ${modelName}`);
      throw new Error(`Failed to create model: ${modelName}`);
    }
    logging.log('----------------------------------------');
    logging.log('Models synchronized successfully');
    logging.log('----------------------------------------');
  }

  async migrate(): Promise<void> {
    if (!this.isConnectedFlag) {
      throw new Error('Cannot migrate: Database not connected');
    }

    logging.info('Running database migrations...');

    for (const [modelName, model] of this.models.entries()) {
      logging.info(`Ensuring indexes for model: ${modelName}`);
      await model.ensureIndexes();
    }

    logging.info('Database migrations completed successfully');
  }

  private createSchema<T>(modelName: string, schema: Schema): Model<T> {
    if (this.models.has(modelName)) {
      return this.models.get(modelName) as Model<T>;
    }

    const model = mongoose.model<T>(modelName, schema);
    this.models.set(modelName, model as Model<T>);
    logging.log(`Schema created for model: ${modelName}`);
    return model;
  }

  isConnected(): boolean {
    return this.isConnectedFlag;
  }

  async getModel<T = unknown>(modelName: string): Promise<Model<T>> {
    if (!this.isConnectedFlag) {
      throw new Error('Cannot get model: Database not connected');
    }
    if (this.models.has(modelName)) {
      return this.models.get(modelName) as Model<T>;
    }
    try {
      const model = mongoose.model(modelName);
      this.models.set(modelName, model as Model<T>);
      logging.info(`Model ${modelName} retrieved successfully`);
      return model as Model<T>;
    } catch (err) {
      throw new Error(`Model ${modelName} not found`);
    }
  }
}
