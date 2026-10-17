// Local demonstration behavior only. Disable this policy when connecting real orders.
export const DEMO_ORDER_POLICY = {
  cleanupEnabled: true,
  fulfillmentDurationMs: 5 * 60 * 1000,
  completedRetentionMs: 2 * 60 * 1000,
  refreshMs: 15000,
} as const;
