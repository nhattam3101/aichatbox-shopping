# Customer order management

`/orders` lists purchases saved by checkout in the `caseup_orders` browser-storage
array, merged with independent recovery records. New checkouts use unique IDs,
never replace existing purchases, and keep the cart if persistence fails.
There is no automatic seeding of purchases. Final demo orders expire as described below.
An existing single-order record is migrated when no order list exists; legacy
ISO creation dates are normalized. Existing stored orders remain available.

The six filter links retain their state in the URL. Detail links use
`/orders?id=<encoded-order-code>&status=<filter>` and return to the same filter.
Browser back/forward and refreshed detail links use URL state directly.
The detail view includes every item and its options, the saved order total,
shipping address, payment method, and a vertical fulfillment timeline.

Seven statuses are defined in `data/orders.ts`. An explicit saved `status`,
including `cancelled`, takes priority. Orders without an explicit status retain
the internal progression based on their saved creation date. No duration or
countdown is rendered. Completed and cancelled local demo orders remain visible for two minutes
after reaching their final state, then are removed deterministically on storage reads and the
order page's 15-second refresh. Active and explicitly non-demo orders
are retained. Cancellation is a
separate state; the UI does not pretend a cancelled order will be delivered.
Eligible orders can be cancelled with a required reason. Confirmation rechecks
the latest stored status and persists `cancelled`, the reason and cancellation
date. There is no refund processing. Reviews are saved per order-item index,
only for delivered products, and cannot be submitted twice for the same item.
Service lines are excluded. Completed orders offer buy-again through the existing
cart action, which retains catalog pricing and customization validation.

Checkout shows a short success message and links to the new order and products.
Adding products again hides the previous success state, allowing another checkout
without interference from any active order. The success link always uses the
newly persisted order ID.
It snapshots structured cart items, saves each order to the list, and preserves
the existing price, discount and shipping calculations. Account navigation on
desktop and the mobile menu provide access to order history. The compact menu
is also used at tablet widths to leave room for navigation controls.

Persistence remains local to this browser/device, consistent with the existing
project. A backend order service and actual carrier updates are not introduced.

Verification: `node scripts/verify-orders.cjs`, `node scripts/verify-account.cjs`, existing verification scripts,
`npm run lint` and `npm run build`. The order script covers status boundaries,
filter groups, cancellation, multiple records, migration, refresh persistence,
rendered cards and detail links, timeline semantics, checkout confirmation and
the absence of timing UI. A browser was unavailable in the implementation
session, so visual viewport checks at 375/768/1024/1440 remain manual. Layout
uses scrollable status navigation, stacked mobile cards and a vertical timeline.
