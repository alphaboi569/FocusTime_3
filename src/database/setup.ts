import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'user_activity.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Timer Sessions table
  CREATE TABLE IF NOT EXISTS timer_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('work', 'break')),
    preset_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Completed Cycles table
  CREATE TABLE IF NOT EXISTS completed_cycles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_session_id INTEGER NOT NULL,
    break_session_id INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_session_id) REFERENCES timer_sessions(id),
    FOREIGN KEY (break_session_id) REFERENCES timer_sessions(id)
  );

  -- Site Visits table
  CREATE TABLE IF NOT EXISTS site_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_url TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_seconds INTEGER,
    blocked BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Daily Stats table
  CREATE TABLE IF NOT EXISTS daily_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL,
    total_work_time_minutes INTEGER DEFAULT 0,
    total_break_time_minutes INTEGER DEFAULT 0,
    completed_cycles INTEGER DEFAULT 0,
    blocked_attempts INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Site Limits table
  CREATE TABLE IF NOT EXISTS site_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_url TEXT UNIQUE NOT NULL,
    daily_limit_minutes INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Database setup completed successfully!');