const { Expo } = require("expo-server-sdk");

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send push notification to a single user
 * @param {string} pushToken - Expo push token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<boolean>} - Success status
 */
async function sendPushNotification(pushToken, title, body, data = {}) {
  // Check if the push token is valid
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return false;
  }

  const message = {
    to: pushToken,
    sound: "default",
    title,
    body,
    data,
    priority: "high",
    channelId: "status-updates", // Android notification channel
  };

  try {
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    // Check for errors in tickets
    for (const ticket of tickets) {
      if (ticket.status === "error") {
        console.error(`Push notification error: ${ticket.message}`);
        if (ticket.details && ticket.details.error) {
          console.error(`Error details: ${ticket.details.error}`);
        }
        return false;
      }
    }

    console.log("Push notification sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending push notification:", error);
    return false;
  }
}

/**
 * Send push notifications to multiple users
 * @param {Array<{pushToken: string, title: string, body: string, data?: object}>} notifications
 * @returns {Promise<{success: number, failed: number}>}
 */
async function sendBulkPushNotifications(notifications) {
  const messages = notifications
    .filter((n) => Expo.isExpoPushToken(n.pushToken))
    .map((n) => ({
      to: n.pushToken,
      sound: "default",
      title: n.title,
      body: n.body,
      data: n.data || {},
      priority: "high",
      channelId: "status-updates",
    }));

  if (messages.length === 0) {
    return { success: 0, failed: notifications.length };
  }

  let success = 0;
  let failed = 0;

  try {
    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);

      for (const ticket of ticketChunk) {
        if (ticket.status === "ok") {
          success++;
        } else {
          failed++;
          console.error(`Push notification error: ${ticket.message}`);
        }
      }
    }
  } catch (error) {
    console.error("Error sending bulk push notifications:", error);
    failed = messages.length;
  }

  return { success, failed };
}

/**
 * Send notification for issue status change
 * @param {object} user - User who created the issue
 * @param {object} issue - The issue that was updated
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 */
async function sendIssueStatusNotification(user, issue, oldStatus, newStatus) {
  if (!user.pushToken) {
    console.log(`User ${user.email} has no push token, skipping notification`);
    return false;
  }

  const statusMessages = {
    open: "is pending review",
    in_progress: "is now being worked on",
    resolved: "has been resolved",
  };

  const title = "🔔 Issue Status Updated";
  const body = `Your issue "${issue.title}" ${statusMessages[newStatus] || `status changed to ${newStatus}`
    }`;

  const data = {
    type: "status_update",
    issueId: issue._id.toString(),
    oldStatus,
    newStatus,
  };

  return await sendPushNotification(user.pushToken, title, body, data);
}

/**
 * Send notification for new admin remark
 * @param {object} user - User who created the issue
 * @param {object} issue - The issue that received a remark
 * @param {string} remark - The admin's remark
 */
async function sendRemarkNotification(user, issue, remark) {
  if (!user.pushToken) {
    console.log(`User ${user.email} has no push token, skipping notification`);
    return false;
  }

  const title = "💬 New Admin Remark";
  const body = `Admin commented on "${issue.title}": ${remark.substring(
    0,
    100
  )}${remark.length > 100 ? "..." : ""}`;

  const data = {
    type: "new_remark",
    issueId: issue._id.toString(),
  };

  return await sendPushNotification(user.pushToken, title, body, data);
}

module.exports = {
  sendPushNotification,
  sendBulkPushNotifications,
  sendIssueStatusNotification,
  sendRemarkNotification,
};
