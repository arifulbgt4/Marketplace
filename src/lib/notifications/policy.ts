export type NotificationCategory = "transactional" | "marketing";
export type NotificationChannel = "email" | "inApp";

export type NotificationPreferenceSnapshot = {
  emailTransactional: boolean;
  emailMarketing: boolean;
  inAppTransactional: boolean;
  inAppMarketing: boolean;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferenceSnapshot =
  {
    emailTransactional: true,
    emailMarketing: false,
    inAppTransactional: true,
    inAppMarketing: false,
  };

/**
 * Transactional delivery is mandatory for account, order, payment, return and
 * shipment operations. Customers can opt in or out only for marketing.
 */
export function notificationChannelEnabled(
  preferences: NotificationPreferenceSnapshot | null | undefined,
  category: NotificationCategory,
  channel: NotificationChannel,
): boolean {
  if (category === "transactional") return true;
  const resolved = preferences ?? DEFAULT_NOTIFICATION_PREFERENCES;
  return channel === "email"
    ? resolved.emailMarketing
    : resolved.inAppMarketing;
}
