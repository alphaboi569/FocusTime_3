import initSqlJs from 'sql.js';
import { format } from 'date-fns';

class ActivityDB {
  private db: any;
  private static instance: ActivityDB;

  private constructor() {}

  static async getInstance() {
    if (!ActivityDB.instance) {
      ActivityDB.instance = new ActivityDB();
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      ActivityDB.instance.db = new SQL.Database();
      await ActivityDB.instance.setupTables();
    }
    return ActivityDB.instance;
  }

  private async setupTables() {
    this.db.run(`
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
  }

  startTimerSession(type: 'work' | 'break', durationMinutes: number, presetId: string) {
    const stmt = this.db.prepare(`
      INSERT INTO timer_sessions (start_time, duration_minutes, type, preset_id)
      VALUES (CURRENT_TIMESTAMP, ?, ?, ?)
    `);
    return stmt.run([durationMinutes, type, presetId]);
  }

  completeTimerSession(sessionId: number) {
    const stmt = this.db.prepare(`
      UPDATE timer_sessions 
      SET end_time = CURRENT_TIMESTAMP, completed = 1
      WHERE id = ?
    `);
    return stmt.run([sessionId]);
  }

  recordCompletedCycle(workSessionId: number, breakSessionId: number) {
    const stmt = this.db.prepare(`
      INSERT INTO completed_cycles (work_session_id, break_session_id)
      VALUES (?, ?)
    `);
    return stmt.run([workSessionId, breakSessionId]);
  }

  startSiteVisit(siteUrl: string) {
    const stmt = this.db.prepare(`
      INSERT INTO site_visits (site_url, start_time)
      VALUES (?, CURRENT_TIMESTAMP)
    `);
    return stmt.run([siteUrl]);
  }

  endSiteVisit(visitId: number) {
    const stmt = this.db.prepare(`
      UPDATE site_visits 
      SET end_time = CURRENT_TIMESTAMP,
          duration_seconds = ROUND((JULIANDAY(CURRENT_TIMESTAMP) - JULIANDAY(start_time)) * 86400)
      WHERE id = ?
    `);
    return stmt.run([visitId]);
  }

  setSiteLimit(siteUrl: string, dailyLimitMinutes: number) {
    const stmt = this.db.prepare(`
      INSERT INTO site_limits (site_url, daily_limit_minutes)
      VALUES (?, ?)
      ON CONFLICT(site_url) DO UPDATE SET 
        daily_limit_minutes = excluded.daily_limit_minutes,
        updated_at = CURRENT_TIMESTAMP
    `);
    return stmt.run([siteUrl, dailyLimitMinutes]);
  }

  getDailyStats(date: Date = new Date()) {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const stmt = this.db.prepare(`
      SELECT * FROM daily_stats WHERE date = ?
    `);
    return stmt.get([formattedDate]);
  }

  getWeeklyStats() {
    return this.db.exec(`
      SELECT 
        date,
        total_work_time_minutes,
        total_break_time_minutes,
        completed_cycles,
        blocked_attempts
      FROM daily_stats
      WHERE date >= date('now', '-7 days')
      ORDER BY date ASC
    `)[0];
  }

  getSiteVisitStats(siteUrl: string, date: Date = new Date()) {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as visit_count,
        SUM(duration_seconds) as total_duration_seconds,
        SUM(CASE WHEN blocked = 1 THEN 1 ELSE 0 END) as blocked_attempts
      FROM site_visits
      WHERE site_url = ?
        AND date(start_time) = ?
    `);
    return stmt.get([siteUrl, formattedDate]);
  }

  exportData() {
    return this.db.export();
  }
}

export const getDB = ActivityDB.getInstance;
export default ActivityDB;