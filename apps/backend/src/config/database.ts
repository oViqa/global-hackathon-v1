import mongoose from 'mongoose';
import { MongoError } from 'mongodb';

export interface DatabaseConfig {
  uri: string;
  database: string;
  maxPoolSize: number;
  minPoolSize: number;
  maxIdleTimeMS: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
  connectTimeoutMS: number;
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  lastError: string | null;
  retryCount: number;
  maxRetries: number;
}

class DatabaseManager {
  private config: DatabaseConfig;
  private state: ConnectionState;
  private retryTimeout: NodeJS.Timeout | null = null;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.config = {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pmitg',
      database: process.env.MONGODB_DATABASE || 'pmitg',
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '5'),
      maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME_MS || '30000'),
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '5000'),
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS || '45000'),
      connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT_MS || '10000'),
    };

    this.state = {
      isConnected: false,
      isConnecting: false,
      lastError: null,
      retryCount: 0,
      maxRetries: 5,
    };

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      this.state.isConnected = true;
      this.state.isConnecting = false;
      this.state.lastError = null;
      this.state.retryCount = 0;
    });

    mongoose.connection.on('error', (error: MongoError) => {
      console.error('❌ MongoDB connection error:', error.message);
      this.state.isConnected = false;
      this.state.lastError = error.message;
      this.handleConnectionError(error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      this.state.isConnected = false;
      this.state.isConnecting = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      this.state.isConnected = true;
      this.state.retryCount = 0;
    });

    // Handle process termination
    process.on('SIGINT', () => this.gracefulShutdown());
    process.on('SIGTERM', () => this.gracefulShutdown());
  }

  private handleConnectionError(error: MongoError): void {
    if (this.state.retryCount < this.state.maxRetries) {
      this.state.retryCount++;
      const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 30000); // Exponential backoff, max 30s
      
      console.log(`🔄 Retrying connection in ${delay}ms (attempt ${this.state.retryCount}/${this.state.maxRetries})`);
      
      this.retryTimeout = setTimeout(() => {
        this.connect().catch((retryError) => {
          console.error('Retry connection failed:', retryError);
        });
      }, delay);
    } else {
      console.error('❌ Max retry attempts reached. MongoDB connection failed permanently.');
      this.state.isConnecting = false;
    }
  }

  public async connect(): Promise<void> {
    if (this.state.isConnected || this.state.isConnecting) {
      return this.connectionPromise || Promise.resolve();
    }

    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    this.state.isConnecting = true;

    this.connectionPromise = this.performConnection();
    return this.connectionPromise;
  }

  private async performConnection(): Promise<void> {
    try {
      console.log('🔄 Connecting to MongoDB...');
      
      await mongoose.connect(this.config.uri, {
        maxPoolSize: this.config.maxPoolSize,
        minPoolSize: this.config.minPoolSize,
        maxIdleTimeMS: this.config.maxIdleTimeMS,
        serverSelectionTimeoutMS: this.config.serverSelectionTimeoutMS,
        socketTimeoutMS: this.config.socketTimeoutMS,
        connectTimeoutMS: this.config.connectTimeoutMS,
        bufferCommands: false,
        bufferMaxEntries: 0,
      });

      console.log(`✅ Connected to MongoDB database: ${this.config.database}`);
    } catch (error) {
      this.state.isConnecting = false;
      this.state.lastError = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
        this.retryTimeout = null;
      }

      if (this.state.isConnected) {
        console.log('🔄 Disconnecting from MongoDB...');
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
      }

      this.state.isConnected = false;
      this.state.isConnecting = false;
    } catch (error) {
      console.error('❌ Error during MongoDB disconnection:', error);
      throw error;
    }
  }

  public getConnectionState(): ConnectionState {
    return { ...this.state };
  }

  public getConnectionInfo(): { readyState: number; host: string; port: number; name: string } {
    return {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };
  }

  public isHealthy(): boolean {
    return this.state.isConnected && mongoose.connection.readyState === 1;
  }

  private async gracefulShutdown(): Promise<void> {
    console.log('🔄 Graceful shutdown initiated...');
    try {
      await this.disconnect();
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
}

// Singleton instance
export const databaseManager = new DatabaseManager();

// Export connection function for easy use
export const connectToDatabase = (): Promise<void> => databaseManager.connect();
export const disconnectFromDatabase = (): Promise<void> => databaseManager.disconnect();
export const getDatabaseState = () => databaseManager.getConnectionState();
export const isDatabaseHealthy = () => databaseManager.isHealthy();

// Export mongoose connection for models
export { mongoose };
