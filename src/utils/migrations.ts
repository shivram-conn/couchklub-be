import Database from './database';

export class DatabaseMigrations {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Create all tables for the CouchKlub application
   */
  public async createTables(): Promise<void> {
    try {
      await this.createUsersTable();
      await this.createClubsTable();
      await this.createGamesTable();
      await this.createClubMembersTable();
      await this.createGamePlayersTable();
      console.log('All tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  private async createUsersTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    await this.db.query(query);
    console.log('Users table created');
  }

  private async createClubsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS clubs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_clubs_owner_id ON clubs(owner_id);
    `;
    await this.db.query(query);
    console.log('Clubs table created');
  }

  private async createGamesTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_games_club_id ON games(club_id);
      CREATE INDEX IF NOT EXISTS idx_games_created_by ON games(created_by);
      CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
    `;
    await this.db.query(query);
    console.log('Games table created');
  }

  private async createClubMembersTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS club_members (
        club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (club_id, user_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_club_members_user_id ON club_members(user_id);
    `;
    await this.db.query(query);
    console.log('Club members table created');
  }

  private async createGamePlayersTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS game_players (
        game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (game_id, user_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON game_players(user_id);
    `;
    await this.db.query(query);
    console.log('Game players table created');
  }

  /**
   * Drop all tables (for development/testing)
   */
  public async dropTables(): Promise<void> {
    const tables = ['game_players', 'club_members', 'games', 'clubs', 'users'];
    
    for (const table of tables) {
      await this.db.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`Dropped table: ${table}`);
    }
  }

  /**
   * Reset database (drop and recreate all tables)
   */
  public async resetDatabase(): Promise<void> {
    await this.dropTables();
    await this.createTables();
    console.log('Database reset completed');
  }
}
