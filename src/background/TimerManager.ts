import { getDB } from '../database';

export class TimerManager {
  private static instance: TimerManager;
  private timers: Map<string, {
    type: 'work' | 'break';
    startTime: number;
    duration: number;
    intervalId?: number;
    pausedAt?: number;
  }> = new Map();

  private constructor() {}

  static getInstance() {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  async startTimer(type: 'work' | 'break', durationMinutes: number, presetId: string) {
    const db = await getDB();
    const session = await db.startTimerSession(type, durationMinutes, presetId);
    const timerId = session.lastInsertRowid.toString();

    const existingTimer = this.timers.get(timerId);
    const startTime = existingTimer?.pausedAt ? 
      Date.now() - (existingTimer.duration - (existingTimer.pausedAt - existingTimer.startTime)) :
      Date.now();

    const timer = {
      type,
      startTime,
      duration: durationMinutes * 60 * 1000,
      intervalId: window.setInterval(() => this.checkTimer(timerId), 1000)
    };

    this.timers.set(timerId, timer);

    // Block sites during break time
    if (type === 'break') {
      await this.blockAllSites();
    }

    // Update badge
    chrome.action.setBadgeText({ text: `${durationMinutes}m` });
    chrome.action.setBadgeBackgroundColor({ color: type === 'work' ? '#4F46E5' : '#22C55E' });

    return timerId;
  }

  private async checkTimer(timerId: string) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    const elapsed = Date.now() - timer.startTime;
    const remaining = Math.max(0, timer.duration - elapsed);

    if (remaining === 0) {
      await this.completeTimer(timerId);
    } else {
      const minutes = Math.ceil(remaining / 60000);
      chrome.action.setBadgeText({ text: `${minutes}m` });
    }
  }

  async completeTimer(timerId: string) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    clearInterval(timer.intervalId);
    this.timers.delete(timerId);

    const db = await getDB();
    await db.completeTimerSession(parseInt(timerId));

    // Clear badge
    chrome.action.setBadgeText({ text: '' });

    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icon-128.png',
      title: timer.type === 'work' ? 'Work Session Complete!' : 'Break Time Over!',
      message: timer.type === 'work' ? 'Time for a break!' : 'Ready to get back to work?'
    });

    // Unblock sites after break
    if (timer.type === 'break') {
      await this.unblockAllSites();
    }

    // If work session completed, start break timer
    if (timer.type === 'work') {
      // Auto-start break timer
      const breakDuration = Math.floor(timer.duration / (60000 * 4));
      await this.startTimer('break', breakDuration, 'auto');
    }
  }

  async pauseTimer(timerId: string) {
    const timer = this.timers.get(timerId);
    if (!timer) return;

    clearInterval(timer.intervalId);
    timer.pausedAt = Date.now();
    this.timers.set(timerId, timer);
    chrome.action.setBadgeText({ text: 'II' });
  }

  async resumeTimer(timerId: string) {
    const timer = this.timers.get(timerId);
    if (!timer || !timer.pausedAt) return;

    const remainingTime = timer.duration - (timer.pausedAt - timer.startTime);
    await this.startTimer(timer.type, Math.ceil(remainingTime / 60000), 'resume');
  }

  private async blockAllSites() {
    // Implement site blocking logic
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [{
        id: 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: { url: chrome.runtime.getURL('blocked.html') }
        },
        condition: {
          urlFilter: '*://*/*',
          resourceTypes: ['main_frame']
        }
      }]
    });
  }

  private async unblockAllSites() {
    // Remove blocking rules
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1]
    });
  }

  isTimerActive(type: 'work' | 'break'): boolean {
    return Array.from(this.timers.values()).some(timer => timer.type === type);
  }
}

export default TimerManager.getInstance();