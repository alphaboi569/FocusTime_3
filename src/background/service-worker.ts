import TimerManager from './TimerManager';
import SiteTracker from './SiteTracker';

// Listen for tab activation
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.url || !tab.url.startsWith('http')) return;

  await SiteTracker.getInstance().trackTab(tabId, tab.url);
});

// Listen for tab URL changes
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    await SiteTracker.getInstance().trackTab(tabId, changeInfo.url);
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener(async (tabId) => {
  await SiteTracker.getInstance().endTracking();
});

// Listen for window focus change
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await SiteTracker.getInstance().endTracking();
  } else {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab?.url && tab.url.startsWith('http')) {
      await SiteTracker.getInstance().trackTab(tab.id!, tab.url);
    }
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case 'START_TIMER':
          const timerId = await TimerManager.getInstance().startTimer(
            message.timerType,
            message.duration,
            message.presetId
          );
          sendResponse({ success: true, timerId });
          break;

        case 'STOP_TIMER':
          await TimerManager.getInstance().stopTimer(message.timerId);
          sendResponse({ success: true });
          break;

        case 'GET_TIMER_STATUS':
          const isWorkActive = TimerManager.getInstance().isTimerActive('work');
          const isBreakActive = TimerManager.getInstance().isTimerActive('break');
          sendResponse({ isWorkActive, isBreakActive });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  })();

  return true; // Keep the message channel open for async response
});

// Update stats every minute
setInterval(() => {
  SiteTracker.getInstance().updateDailyStats();
}, 60000);