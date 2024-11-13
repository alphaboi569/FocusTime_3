import { getDB } from '../database';

export class SiteTracker {
  private static instance: SiteTracker;
  private activeTab: {
    id: number;
    url: string;
    startTime: number;
    intervalId?: number;
  } | null = null;

  private constructor() {}

  static getInstance() {
    if (!SiteTracker.instance) {
      SiteTracker.instance = new SiteTracker();
    }
    return SiteTracker.instance;
  }

  async trackTab(tabId: number, url: string) {
    // End tracking of previous tab
    if (this.activeTab) {
      await this.endTracking();
    }

    const hostname = new URL(url).hostname;
    const db = await getDB();
    
    this.activeTab = {
      id: tabId,
      url: hostname,
      startTime: Date.now(),
      intervalId: window.setInterval(() => this.checkLimits(), 1000)
    };

    await db.startSiteVisit(hostname);
  }

  private async checkLimits() {
    if (!this.activeTab) return;

    const db = await getDB();
    const stats = await db.getSiteVisitStats(this.activeTab.url);
    
    if (stats.total_duration_seconds >= stats.daily_limit_seconds) {
      await this.blockSite();
    }
  }

  private async blockSite() {
    if (!this.activeTab) return;

    const db = await getDB();
    await db.recordBlockedAttempt(this.activeTab.url);
    
    chrome.tabs.update(this.activeTab.id, {
      url: chrome.runtime.getURL('blocked.html')
    });

    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icon-128.png',
      title: 'Site Blocked',
      message: `You've reached your daily limit for ${this.activeTab.url}`
    });
  }

  async endTracking() {
    if (!this.activeTab) return;

    const db = await getDB();
    clearInterval(this.activeTab.intervalId);
    
    const duration = Math.floor((Date.now() - this.activeTab.startTime) / 1000);
    await db.endSiteVisit(this.activeTab.url, duration);
    
    this.activeTab = null;
  }

  async updateDailyStats() {
    const db = await getDB();
    const today = new Date().toISOString().split('T')[0];
    const stats = await db.getDailyStats(today);

    // Update badge with today's total time
    const hours = Math.floor(stats.total_time_minutes / 60);
    const minutes = stats.total_time_minutes % 60;
    chrome.action.setBadgeText({ 
      text: `${hours}:${minutes.toString().padStart(2, '0')}` 
    });
  }
}

export default SiteTracker.getInstance();