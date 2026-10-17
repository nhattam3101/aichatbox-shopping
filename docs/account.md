# Local CaseUp account features

## Orders

`data/orders.ts` owns cancellation and review eligibility, validation and writes.
Checkout uses `createStoredOrder`, which creates a collision-checked random ID
and deep snapshots the submitted options. It never upserts an existing ID.
Mutations use a same-document queue and the browser Web Locks API when available
to serialize changes across tabs. Each saved order also has an independent
`caseup_order_record:` recovery record; the compatible `caseup_orders` array is
merged with these records on load so a stale array write cannot discard another
order. Browsers without Web Locks retain per-order recovery and same-document
serialization; concurrent writes to the same order across tabs are not fully
transactional there. The existing local-only storage model remains unchanged.
Cancellation reads the latest stored order on confirmation, accepts one of five
defined reasons and is allowed only before carrier handoff. Persisting an
explicit cancelled status stops internal progression. Failed storage writes
return a friendly error and do not report success.

Reviews require a delivered order, a catalog product (not a service), an integer
rating from 1–5 and optional text up to 1,000 characters. The immutable order-item
index identifies the reviewed line, including separate variants of a product.
Each submission reads the latest record to reject duplicates and preserves other
reviews. Image uploads and review editing are not included.

`OrderActions` is shared by list cards and order details. Dialogs reuse
`AccountDialog` and the existing focus trap, Escape dismissal, scroll lock and
focus restoration. Buy-again uses `CartContext.addToCart`; no price or discount
calculation is introduced. Items with unconfirmed or unavailable catalog entries
are not silently added.

## Vouchers and account navigation

`data/vouchers.ts` supplies display-only voucher records to `/vouchers` and
notifications. No expiry dates or new discount conditions are assumed.
CASEUP10 and FREESHIP retain existing checkout behavior. BACKTOSCHOOL is
informational and links to products. Copy uses the Clipboard API, with a friendly
manual-copy message if unavailable. “Dùng ngay” opens the configured destination
without automatically applying discounts.

`data/account-navigation.ts` defines links used by the desktop account dropdown,
mobile account section and account-page navigation.

## Notifications

`data/notifications.ts` combines voucher/campaign information with each order's
current status. IDs include the order status so a new status becomes unread.
Read IDs persist in `caseup_notification_reads`; marking one or all read updates
other mounted components through a same-document event. Storage and window-focus
events synchronize updates across tabs. The notification hook refreshes statuses
internally without exposing timing details. A badge appears in account navigation
and the mobile menu. This is local browser information, not push or carrier data.

## Homepage promotion

`PromotionPopup` is mounted only on the homepage and also checks the pathname.
`data/promotions.ts` owns the campaign and supports `session` or rolling `day`
frequency. Display is recorded before opening, so dismissal, CTA navigation and
returning home do not reopen it during the configured period. Unavailable
storage suppresses the popup. Change the campaign ID to launch a new campaign.

`promotionAds` lists `/products/ad1.png`, `/products/ad2.png` and
`/products/ad3.png`, including actual image dimensions and per-ad destinations.
One ad is selected randomly on display. All three share the campaign's seen
period, so rotating creatives cannot reopen the popup during the same session.
Images use `object-contain` and their original aspect ratio, with no placeholder
gradient or newly invented discount calculation. Add another record to the list
to extend the rotation. The supplied assets show CASEUP10; checkout formulas
are unchanged. Cleanup closes the popup when a cached homepage is hidden.

## Verification

Run `node scripts/verify-account.cjs`, `node scripts/verify-orders.cjs`, the existing
catalog/customization/mockup verification scripts, `npm run lint` and
`npm run build`. The account harness exercises actual dialog submit handlers,
buy-again and clipboard callbacks in addition to persistence and permission rules.
`node scripts/verify-serving.cjs` checks production routes and all three original
and optimized image URLs against a server started on port 3001 (or pass a base
URL as its argument). Navbar checks cover compact badges, one-line desktop
labels, account links and Escape dismissal. The exact A/B/cancel-A/C checkout
test also covers stale-array recovery, concurrent creates, forced ID collisions,
duplicate submits and storage failures.

Browser rendering at 375/768/1024/1440 remains a manual check because no browser
was available in this session. New cards wrap on small widths; dialogs are
bounded to 90dvh and scroll internally; star controls and actions have 44px touch
targets. There are no visible timers, countdowns or simulation labels.
