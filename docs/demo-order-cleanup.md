# Completed demo-order retention

`data/demo-orders.ts` is the isolated policy configuration: cleanup enabled,
five-minute internal fulfillment progression, two-minute completed retention,
and a 15-second page refresh. Set `cleanupEnabled` to false to disable cleanup.

New local checkouts are marked `demo: true`. Legacy orders without a saved status
are recognized as the existing automatically progressed demo records. Explicit
`demo: false` records and unmarked orders with externally supplied statuses are
protected. Cancelled and active statuses never qualify for this cleanup.

`demoCompletionTime` uses a valid `completedAt`, or derives completion from
`createdAt + fulfillmentDurationMs`. `loadStoredOrders(now)` calls deterministic
cleanup: completed demo orders expire when `now - completedAt >= 120000`.
Expired IDs are removed from the list snapshot, independent recovery records
and matching legacy single-order storage. Reloading cannot resurrect them.

The existing app-load notification hook reads the order store; `/orders` also
reloads the in-memory list every 15 seconds and clears its interval on unmount.
No per-order timeouts or customer-facing cleanup timing is introduced.

`node scripts/verify-demo-cleanup.cjs` tests both sides of the exact retention
boundary, reloads, mixed independent orders, legacy cleanup and protection for
active, cancelled and real records. Storage failures are retried on the next
read while expired entries remain excluded from the current in-memory result.
