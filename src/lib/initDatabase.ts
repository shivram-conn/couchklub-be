import Database, { getDatabaseConfigFromEnv } from '@/lib/database';
import { DatabaseMigrations } from '@/lib/migrations';

export async function initializeDatabase(): Promise<Database> {
  try {
    // Get database configuration from configs
    const config = getDatabaseConfigFromEnv();
    
    // Initialize database instance
    const db = Database.getInstance(config);
    
    // Test connection
    const isConnected = await db.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }
    
    // Run migrations
    // const migrations = new DatabaseMigrations(db);
    // await migrations.createTables();
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function resetDatabase(): Promise<void> {
  try {
    const config = getDatabaseConfigFromEnv();
    const db = Database.getInstance(config);
    const migrations = new DatabaseMigrations(db);
    
    await migrations.resetDatabase();
    console.log('Database reset completed');
  } catch (error) {
    console.error('Database reset failed:', error);
    throw error;
  }
}
