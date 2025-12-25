import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ISSUE_STATUS_CACHE_KEY = '@campus_fixit_issue_status_cache';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions (call on app start)
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Set up Android notification channels
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('status-updates', {
      name: 'Issue Status Updates',
      description: 'Notifications when your issue status changes',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
    });
  }

  return finalStatus === 'granted';
}

/**
 * Show a local notification immediately
 */
export async function showLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // Show immediately
  });
}

/**
 * Show notification for issue status change
 */
export async function showStatusChangeNotification(
  issueTitle: string,
  oldStatus: string,
  newStatus: string,
  issueId: string
): Promise<void> {
  const statusMessages: Record<string, string> = {
    'open': 'is now open',
    'in_progress': 'is now being worked on',
    'resolved': 'has been resolved! 🎉',
  };

  const statusEmojis: Record<string, string> = {
    'open': '📋',
    'in_progress': '🔧',
    'resolved': '✅',
  };
  

  const emoji = statusEmojis[newStatus] || '🔔';
  const message = statusMessages[newStatus] || `status changed to ${newStatus}`;

  await showLocalNotification(
    `${emoji} Issue Updated`,
    `"${issueTitle}" ${message}`,
    { issueId, type: 'status_update', oldStatus, newStatus }
  );
}

/**
 * Store issue statuses to detect changes later
 */
export async function cacheIssueStatuses(issues: { id: string; status: string }[]): Promise<void> {
  try {
    const statusMap: Record<string, string> = {};
    issues.forEach(issue => {
      statusMap[issue.id] = issue.status;
    });
    await AsyncStorage.setItem(ISSUE_STATUS_CACHE_KEY, JSON.stringify(statusMap));
  } catch (error) {
    console.error('Error caching issue statuses:', error);
  }
}

/**
 * Get cached issue statuses
 */
export async function getCachedIssueStatuses(): Promise<Record<string, string>> {
  try {
    const cached = await AsyncStorage.getItem(ISSUE_STATUS_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error('Error getting cached issue statuses:', error);
    return {};
  }
}

/**
 * Check for status changes and show notifications
 */
export async function checkAndNotifyStatusChanges(
  issues: { id: string; title: string; status: string }[]
): Promise<void> {
  try {
    const cachedStatuses = await getCachedIssueStatuses();
    
    // Check each issue for status changes
    for (const issue of issues) {
      const oldStatus = cachedStatuses[issue.id];
      
      // If we have a cached status and it's different, notify
      if (oldStatus && oldStatus !== issue.status) {
        await showStatusChangeNotification(
          issue.title,
          oldStatus,
          issue.status,
          issue.id
        );
      }
    }

    // Update the cache with current statuses
    await cacheIssueStatuses(issues.map(i => ({ id: i.id, status: i.status })));
  } catch (error) {
    console.error('Error checking status changes:', error);
  }
}

/**
 * Clear the status cache (call on logout)
 */
export async function clearStatusCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ISSUE_STATUS_CACHE_KEY);
  } catch (error) {
    console.error('Error clearing status cache:', error);
  }
}

/**
 * Add a listener for notification responses (when user taps notification)
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Remove notification subscription
 */
export function removeNotificationSubscription(subscription: Notifications.Subscription): void {
  subscription.remove();
}

/**
 * Set badge count (iOS)
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Get badge count (iOS)
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}
