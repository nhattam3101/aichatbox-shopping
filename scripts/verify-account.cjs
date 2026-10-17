/* eslint-disable @typescript-eslint/no-require-imports -- Isolated local account and UI verification without paid APIs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const store = new Map(), session = new Map();
const storage = map => ({ get length() { return map.size; }, key: i => [...map.keys()][i] ?? null, removeItem: key => map.delete(key), getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) });
global.window = { dispatchEvent() {} };
global.localStorage = storage(store); global.sessionStorage = storage(session);
let slots = [], cursor = 0, pathname = '/', copied = '', added = [], changed = 0;
const now = 1800000000000;
const originalLoad = Module._load;
Module._load = function(request, ...args) {
  if (request === 'react') return { ...React, useEffect() {}, useRef: value => ({ current: value }), useState(value) {
    const index = cursor++; if (!(index in slots)) slots[index] = value; return [slots[index], update => { slots[index] = update; }];
  } };
  if (request === 'next/navigation') return { usePathname: () => pathname };
  if (request === 'next/link') return { __esModule: true, default: 'a' };
  if (request === 'next/image') return { __esModule: true, default: ({ priority, ...props }) => { void priority; return React.createElement('img', props); } };
  if (request === '@/components/Navbar') return { __esModule: true, default: () => null };
  if (['@/components/GlobalSearchModal', '@/components/WishlistDrawer'].includes(request)) return { __esModule: true, default: () => null };
  if (request === '@/components/WishlistContext') return { useWishlist: () => ({ wishlistCount: 0, setIsWishlistOpen() {} }) };
  if (request === '@/components/useDialogFocus') return { useDialogFocus: () => null };
  if (request === '@/components/useCustomerNotifications') return { useCustomerNotifications: () => {
    const feed = require('../data/notifications.ts').getNotifications(now);
    return { notifications: feed, loaded: true, unreadCount: feed.filter(n => !n.read).length };
  } };
  if (request === '@/components/CartContext') return { useCart: () => ({ totalItems: 125, addToCart: item => added.push(item) }) };
  return originalLoad.call(this, request.startsWith('@/') ? path.resolve(__dirname, '..', request.slice(2)) : request, ...args);
};
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
(async () => {
const orders = require('../data/orders.ts');
const notifications = require('../data/notifications.ts');
const promotions = require('../data/promotions.ts');
const { vouchers } = require('../data/vouchers.ts');
const fixture = { orderId: '#CU-TEST', items: [{ id: 3, name: 'Bao bảo vệ Laptop 14 inch', price: 129000, image: '/products/product_06.jpg', size: '14 inch', selectedColor: 'Đen', selectedButton: 'Baby Blue', quantity: 1 }], total: 129000, totalQuantity: 1, customerName: 'Khách hàng', phone: '0123456789', address: 'Địa chỉ nhận hàng', note: '', paymentMethod: 'cod', createdAt: now, createdAtDisplay: '' };
for (const step of orders.ORDER_STATUS_STEPS) {
  orders.saveStoredOrders([{ ...fixture, status: step.id }]);
  const result = await orders.cancelOrder(fixture.orderId, orders.CANCELLATION_REASONS[0], now);
  const eligible = ['placed', 'pending', 'preparing'].includes(step.id);
  assert.equal(result.success, eligible);
  if (eligible) {
    const saved = orders.loadStoredOrders()[0];
    assert.equal(orders.getOrderStatus(saved, now + 86400000).id, 'cancelled');
    assert.ok(orders.matchesOrderFilter(saved, 'cancelled', now));
    assert.equal(saved.cancellationReason, orders.CANCELLATION_REASONS[0]);
  }
}
orders.saveStoredOrders([fixture]);
assert.equal((await orders.cancelOrder(fixture.orderId, '', now)).success, false);
assert.equal((await orders.cancelOrder(fixture.orderId, orders.CANCELLATION_REASONS[0], now + 180000)).success, false, 'recheck progression at confirmation');
assert.equal((await orders.submitOrderReview(fixture.orderId, 0, 5, '', now)).success, false);
orders.saveStoredOrders([{ ...fixture, status: 'delivered', items: [fixture.items[0], { ...fixture.items[0], selectedColor: 'Navy' }] }]);
for (const rating of [0, 6, 1.5]) assert.equal((await orders.submitOrderReview(fixture.orderId, 0, rating, '', now)).success, false);
assert.equal((await orders.submitOrderReview(fixture.orderId, 99, 5, '', now)).success, false);
assert.equal((await orders.submitOrderReview(fixture.orderId, 0, 5, 'x'.repeat(1001), now)).success, false);
assert.equal((await orders.submitOrderReview(fixture.orderId, 0, 5, 'Rất đẹp', now)).success, true);
assert.equal((await orders.submitOrderReview(fixture.orderId, 0, 4, 'duplicate', now)).success, false);
assert.equal((await orders.submitOrderReview(fixture.orderId, 1, 4, '', now)).success, true, 'each order item reviewed separately');
assert.equal(orders.loadStoredOrders()[0].reviews[0].text, 'Rất đẹp');
orders.saveStoredOrders([{ ...fixture, status: 'delivered' }]);
const repeatedReview = await Promise.all([orders.submitOrderReview(fixture.orderId, 0, 5, 'First', now), orders.submitOrderReview(fixture.orderId, 0, 1, 'Duplicate', now)]);
assert.equal(repeatedReview.filter(result => result.success).length, 1, 'concurrent duplicate submission protected');
assert.equal(orders.loadStoredOrders()[0].reviews[0].text, 'First');
orders.saveStoredOrders([{ ...fixture, status: 'delivered', items: [{ ...fixture.items[0], id: 7 }] }]);
assert.equal((await orders.submitOrderReview(fixture.orderId, 0, 5, '', now)).success, false, 'service excluded');
orders.saveStoredOrders([{ ...fixture, status: 'preparing' }]);
let feed = notifications.getNotifications(now);
assert.equal(feed.filter(n => n.id.startsWith('voucher:')).length, vouchers.length);
assert.ok(feed.some(n => n.title.includes('Đang chuẩn bị')));
assert.ok(notifications.markNotificationsRead([feed[0].id]));
assert.ok(notifications.getNotifications(now)[0].read);
feed = notifications.getNotifications(now);
notifications.markNotificationsRead(feed.map(n => n.id));
assert.ok(notifications.getNotifications(now).every(n => n.read));
orders.saveStoredOrders([{ ...fixture, status: 'delivered' }]);
assert.equal(notifications.getNotifications(now)[0].read, false, 'new order status becomes unread');
assert.ok(promotions.claimPromotion(promotions.homepagePromotionPolicy, now));
assert.equal(promotions.claimPromotion(promotions.homepagePromotionPolicy, now + 1000), false);
session.clear(); assert.ok(promotions.claimPromotion(promotions.homepagePromotionPolicy, now + 1000));
const daily = { ...promotions.homepagePromotionPolicy, id: 'daily', frequency: 'day' };
assert.ok(promotions.claimPromotion(daily, now));
assert.equal(promotions.claimPromotion(daily, now + 86399999), false);
assert.ok(promotions.claimPromotion(daily, now + 86400000));
assert.equal(new Set(promotions.promotionAds.map(ad => ad.id)).size, 2);
for (let index = 0; index < promotions.promotionAds.length; index++) {
  const ad = promotions.selectPromotion(promotions.promotionAds, (index + 0.5) / promotions.promotionAds.length);
  assert.equal(ad.id, `ad${index + 5}`, 'all ads can be randomly selected');
  const bytes = fs.readFileSync(path.resolve(__dirname, '../public', ad.image.slice(1)));
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  assert.equal(bytes.readUInt32BE(16), ad.width);
  assert.equal(bytes.readUInt32BE(20), ad.height);
}

const Actions = require('../components/OrderActions.tsx').default;
const Copy = require('../components/CopyVoucherButton.tsx').default;
const Popup = require('../components/PromotionPopup.tsx').default;
const VoucherPage = require('../app/vouchers/page.tsx').default;
const NotificationsPage = require('../app/notifications/page.tsx').default;
const Navbar = require('../components/Navbar.tsx').default;
function render(Component, props, seed = []) { slots = seed; cursor = 0; return renderToStaticMarkup(React.createElement(Component, props)); }
for (const step of orders.ORDER_STATUS_STEPS) {
  const html = render(Actions, { order: { ...fixture, status: step.id }, now, onChange() {} });
  assert.equal(html.includes('Hủy đơn'), ['placed', 'pending', 'preparing'].includes(step.id));
  assert.equal(html.includes('Đánh giá sản phẩm'), step.id === 'delivered');
  assert.equal(html.includes('Mua lại'), step.id === 'delivered');
}
function nodes(node) { return node && typeof node === 'object' ? [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)] : []; }
  orders.saveStoredOrders([{ ...fixture, status: 'preparing' }]);
  slots = ['cancel', orders.CANCELLATION_REASONS[1], '', 0, '', '', '', false]; cursor = 0;
  const cancelTree = Actions({ order: { ...fixture, status: 'preparing' }, now, onChange: () => changed++ });
  await nodes(cancelTree).find(node => node.type === 'form').props.onSubmit({ preventDefault() {} });
  assert.equal(orders.loadStoredOrders()[0].status, 'cancelled'); assert.equal(changed, 1);
  orders.saveStoredOrders([{ ...fixture, status: 'delivered' }]);
  slots = ['review', '', '0', 5, 'Đẹp', '', '', false]; cursor = 0;
  await nodes(Actions({ order: { ...fixture, status: 'delivered' }, now, onChange() {} })).find(n => n.type === 'form').props.onSubmit({ preventDefault() {} });
  assert.equal(orders.loadStoredOrders()[0].reviews[0].rating, 5);
  assert.ok(slots.includes('Cảm ơn bạn đã đánh giá CaseUp!'));
  assert.ok(render(Actions, { order: orders.loadStoredOrders()[0], now, onChange() {} }).includes('Đã đánh giá sản phẩm'));
  slots = []; cursor = 0;
  const buyTree = Actions({ order: { ...fixture, status: 'delivered' }, now, onChange() {} });
  nodes(buyTree).find(n => n.type === 'button' && n.props.children === 'Mua lại').props.onClick();
  assert.equal(added.length, 1); assert.equal(added[0].selectedButton, 'Baby Blue');
  Object.defineProperty(global, 'navigator', { configurable: true, value: { clipboard: { writeText: async code => { copied = code; } } } });
  slots = []; cursor = 0; await nodes(Copy({ code: 'FREESHIP' })).find(n => n.type === 'button').props.onClick();
  assert.equal(copied, 'FREESHIP'); assert.ok(slots.includes('Đã sao chép mã.'));
  const voucherHtml = render(VoucherPage);
  for (const voucher of vouchers) assert.ok(voucherHtml.includes(voucher.title));
  assert.ok(voucherHtml.includes('Sao chép mã')); assert.ok(voucherHtml.includes('Dùng ngay'));
  store.delete('caseup_notification_reads');
  slots = []; cursor = 0;
  const notificationTree = NotificationsPage();
  nodes(notificationTree).find(n => n.type === 'button' && n.props.children === 'Đánh dấu tất cả đã đọc').props.onClick();
  assert.ok(notifications.getNotifications(now).every(n => n.read));
  assert.ok(render(NotificationsPage).includes('0 thông báo chưa đọc'));
  pathname = '/orders'; assert.equal(render(Popup, { campaign: promotions.homepagePromotionPolicy }, [true]), '');
  pathname = '/'; const popupHtml = render(Popup, { campaign: promotions.homepagePromotionPolicy }, [true, promotions.promotionAds[1]]);
  assert.ok(popupHtml.includes('ad6.png')); assert.ok(popupHtml.includes('Khám phá ngay'));
  for (const ad of promotions.promotionAds) {
    const html = render(Popup, { campaign: promotions.homepagePromotionPolicy }, [true, ad]);
    assert.equal((html.match(/<img/g) ?? []).length, 1, 'exactly one promotion image');
    assert.ok(html.includes(ad.image)); assert.ok(html.includes('object-contain'));
  }
  slots = [true, promotions.promotionAds[0]]; cursor = 0;
  Popup({ campaign: promotions.homepagePromotionPolicy }).props.onClose();
  assert.equal(slots[0], false, 'close dismisses popup');
  const navbarHtml = render(Navbar);
  assert.ok(navbarHtml.includes('99+'), 'cart badge stays compact');
  assert.ok(navbarHtml.includes('shrink-0 flex-nowrap items-center gap-0.5 whitespace-nowrap xl:flex'));
  assert.ok(navbarHtml.includes('xl:hidden'), 'compact menu is available below desktop breakpoint');
  const expandedNavbar = render(Navbar, {}, [true, false]);
  for (const label of ['Trang chủ', 'Sản phẩm', 'Tự thiết kế', 'Chọn size', 'Về chúng tôi', 'Tài khoản', 'Đơn hàng của tôi', 'Voucher của tôi', 'Thông báo']) assert.ok(expandedNavbar.includes(label));
  slots = []; cursor = 0;
  const navbarTree = Navbar();
  let focused = false;
  const details = { open: true, querySelector: () => ({ focus: () => { focused = true; } }) };
  nodes(navbarTree).find(n => n.type === 'details').props.onKeyDown({ key: 'Escape', currentTarget: details });
  assert.equal(details.open, false); assert.ok(focused);
  const forbidden = /countdown|elapsed|lifecycle|demo simulation|Chuyển bước kế sau|Thời gian đã trôi qua|phút/;
  assert.ok(!forbidden.test(popupHtml + voucherHtml));
  const originalSet = localStorage.setItem;
  localStorage.setItem = () => { throw new Error('storage unavailable'); };
  assert.equal(notifications.markNotificationsRead(['test']), false);
  assert.equal(promotions.claimPromotion({ ...daily, id: 'unavailable' }, now), false);
  localStorage.setItem = originalSet;
  console.log('PASS: eligible cancellation/recheck/persistence, review gates/duplicates/item identity, action dialogs, buy again, voucher render/copy, notification read/unread updates, homepage-only popup/session/day limits, storage errors.');
})().catch(error => { console.error(error); process.exitCode = 1; });
