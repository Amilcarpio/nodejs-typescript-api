export interface IDatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  migrate(): Promise<void>;
  initializeModels(modelName: string, modelSchema: unknown): Promise<void>;
  isConnected(): boolean;
  getModel<T = unknown>(
    modelName: string
  ): Promise<import('mongoose').Model<T>>;
}
