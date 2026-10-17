/* eslint-disable @typescript-eslint/no-require-imports -- Render TypeScript fixtures with isolated browser state. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const storage = new Map();
global.window = {};
global.localStorage = { get length() { return storage.size; }, key: i => [...storage.keys()][i] ?? null, removeItem: key => storage.delete(key), getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
let hookValues = [], hookIndex = 0, query = '';
let cartItems = [], cleared = false;
const originalLoad = Module._load;
Module._load = function(request, ...args) {
  if (request === 'react') return { ...React, useEffect() {}, useRef: value => ({ current: value }), useState: initial => [hookValues[hookIndex++] ?? initial, () => {}] };
  if (request === 'next/navigation') return { useSearchParams: () => new URLSearchParams(query) };
  if (request === 'next/link') return { __esModule: true, default: ({ children, scroll: ignoredScroll, ...props }) => { void ignoredScroll; return React.createElement('a', props, children); } };
  if (request === 'next/image') return { __esModule: true, default: ({ fill: ignoredFill, ...props }) => { void ignoredFill; return React.createElement('img', props); } };
  if (['@/components/Navbar', '@/components/ChatBox'].includes(request)) return { __esModule: true, default: () => null };
  if (request === '@/components/useDialogFocus') return { useDialogFocus: () => null };
  if (request === '@/components/CartContext') return { useCart: () => ({ cart: cartItems, totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0), totalPrice: 248000, discountAmount: 10000, clearCart: () => { cleared = true; } }) };
  return originalLoad.call(this, request.startsWith('@/') ? path.resolve(__dirname, '..', request.slice(2)) : request, ...args);
};
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
(async () => {
const data = require('../data/orders.ts');
const now = 1800000000000;
const fixture = { orderId: '#CU-TEST', items: [{ id: 3, name: 'Bao bảo vệ Laptop 14 inch', price: 129000, image: '/products/product_06.jpg', size: '14 inch', selectedColor: 'Đen', selectedButton: 'Baby Blue', quantity: 1 }], total: 129000, totalQuantity: 1, customerName: 'Khách hàng', phone: '0123456789', address: 'Địa chỉ nhận hàng', note: '', paymentMethod: 'cod', createdAt: now, createdAtDisplay: '' };
assert.deepEqual(data.loadStoredOrders(), [], 'no seeded purchases');
for (const [index, step] of data.ORDER_STATUS_STEPS.slice(0, 6).entries()) {
  assert.equal(data.getOrderStatus(fixture, now + index * 60000).id, step.id);
  if (index) assert.equal(data.getOrderStatus(fixture, now + index * 60000 - 1).id, data.ORDER_STATUS_STEPS[index - 1].id);
}
assert.equal(data.getOrderStatus(fixture, now - 1).id, 'placed');
assert.equal(data.getOrderStatus(fixture, now + 86400000).id, 'delivered');
const orders = data.ORDER_STATUS_STEPS.map((step, index) => ({ ...fixture, orderId: `#CU-${index}`, status: step.id, createdAt: now - index * 1000 }));
orders.forEach(data.addStoredOrder);
assert.equal(data.loadStoredOrders().length, 7);
data.addStoredOrder({ ...orders[0], note: 'updated' });
assert.equal(data.loadStoredOrders().length, 7, 'deduplicate IDs');
assert.equal(data.loadStoredOrders().find(o => o.orderId === orders[0].orderId).note, 'updated');
assert.equal(data.getOrderStatus(data.loadStoredOrders().find(o => o.status === 'cancelled'), now + 86400000).id, 'cancelled');
assert.equal(data.getOrderStatus({ ...fixture, status: 'preparing' }, now + 86400000).id, 'preparing');
const expectedCounts = [7, 2, 2, 1, 1, 1];
for (const [index, filter] of data.ORDER_FILTERS.entries()) assert.equal(orders.filter(o => data.matchesOrderFilter(o, filter.id, now)).length, expectedCounts[index]);
storage.clear(); storage.set('caseup_demo_order', JSON.stringify({ ...fixture, createdAt: new Date(now).toISOString() }));
assert.equal(data.loadStoredOrders()[0].createdAt, now, 'legacy migration');
assert.equal(data.loadStoredOrders()[0].orderId, fixture.orderId, 'refresh preserves migrated order');
storage.set('caseup_orders', '[]'); assert.deepEqual(data.loadStoredOrders(), [], 'empty list does not resurrect legacy orders');
storage.set('caseup_orders', JSON.stringify([{}, fixture])); assert.equal(data.loadStoredOrders().length, 1);

const Page = require('../app/orders/page.tsx').default;
const Timeline = require('../components/OrderTrackingTimeline.tsx').default;
const Cart = require('../app/cart/page.tsx').default;
const forbidden = /Chuyển bước kế sau|Thời gian đã trôi qua|phút|giây|demo simulation|lifecycle|Xóa đơn demo|countdown/i;
function render(Component, props = {}) { hookIndex = 0; const html = renderToStaticMarkup(React.createElement(Component, props)); assert.ok(!forbidden.test(html)); return html; }
for (const [index, filter] of data.ORDER_FILTERS.entries()) {
  hookValues = [orders, now, true]; query = `status=${filter.id}`;
  const html = render(Page);
  assert.equal((html.match(/<article/g) ?? []).length, expectedCounts[index]);
  assert.ok(html.includes('Xem chi tiết đơn hàng'));
  assert.ok(html.includes('Baby Blue'));
}
query = `id=${encodeURIComponent(orders[2].orderId)}&status=preparing`;
hookValues = [orders, now, true];
const detail = render(Page);
for (const label of ['Địa chỉ nhận hàng', 'Thanh toán', 'Tổng thanh toán', 'Hành trình đơn hàng', 'Hiện tại', 'Đã hoàn tất', 'Chưa đến']) assert.ok(detail.includes(label));
assert.ok(detail.includes('href="/orders?status=preparing"'), 'back retains filter');
assert.equal((detail.match(/aria-current="step"/g) ?? []).length, 1);
const cancelled = render(Timeline, { order: orders[6], currentTime: now });
assert.ok(cancelled.includes('Đã hủy')); assert.ok(!cancelled.includes('aria-current="step"'));
query = 'id=missing'; assert.ok(render(Page).includes('Không tìm thấy đơn hàng'));
hookValues = [false, fixture.customerName, fixture.phone, fixture.address, '', 'cod', '', null, fixture];
const confirmation = render(Cart);
for (const label of ['Đặt hàng thành công!', 'Cảm ơn bạn', 'CaseUp đã tiếp nhận đơn hàng của bạn.', 'Xem đơn hàng', 'Tiếp tục mua sắm']) assert.ok(confirmation.includes(label));
assert.ok(!confirmation.includes('Hành trình đơn hàng'));
// Exercise the actual checkout submit handler, preserving structured options and the supplied cart total.
storage.clear();
cartItems = [{ ...fixture.items[0], quantity: 2, sizeMode: 'custom', customDimensions: { lengthCm: 32.5, widthCm: 22, thicknessCm: 2 } }];
hookValues = [true, fixture.customerName, fixture.phone, fixture.address, '', 'cod', '', null, null];
hookIndex = 0;
function findForm(node) {
  if (!node || typeof node !== 'object') return null;
  if (node.type === 'form' && node.props.onSubmit?.name === 'handleConfirmOrder') return node;
  for (const child of [node.props?.children].flat(Infinity)) { const found = findForm(child); if (found) return found; }
  return null;
}
await findForm(Cart()).props.onSubmit({ preventDefault() {} });
assert.ok(cleared);
let saved = data.loadStoredOrders();
assert.equal(saved.length, 1);
assert.equal(saved[0].total, 248000);
assert.equal(saved[0].discountAmount, 10000);
assert.equal(saved[0].totalQuantity, 2);
assert.deepEqual(saved[0].items, cartItems);
cartItems[0].customDimensions.lengthCm = 40;
assert.equal(data.loadStoredOrders()[0].items[0].customDimensions.lengthCm, 32.5);
hookIndex = 0; await findForm(Cart()).props.onSubmit({ preventDefault() {} });
saved = data.loadStoredOrders(); assert.equal(saved.length, 2, 'successive checkouts retain earlier purchases');
// Exact A/B/C flow: keep A active, create B, cancel only A, then create C.
const orderA = saved.find(order => order.items[0].customDimensions.lengthCm === 32.5);
const orderB = saved.find(order => order.orderId !== orderA.orderId);
assert.deepEqual(orderA.items[0].customDimensions, { lengthCm: 32.5, widthCm: 22, thicknessCm: 2 });
assert.notEqual(orderA.orderId, orderB.orderId);
const unchangedB = JSON.stringify(orderB);
assert.equal(data.getOrderStatus(orderA, orderA.createdAt + 60000).id, 'pending');
assert.equal(data.getOrderStatus(orderB, orderB.createdAt + 240000).id, 'shipping');
assert.ok((await data.cancelOrder(orderA.orderId, data.CANCELLATION_REASONS[0], orderA.createdAt + 60000)).success);
assert.equal(JSON.stringify(data.loadStoredOrders().find(o => o.orderId === orderB.orderId)), unchangedB);
hookIndex = 0; await findForm(Cart()).props.onSubmit({ preventDefault() {} });
saved = data.loadStoredOrders(); assert.equal(saved.length, 3);
assert.equal(saved[0].orderId === orderA.orderId || saved[0].orderId === orderB.orderId, false, 'C is newest');
assert.equal(data.getOrderStatus(saved.find(o => o.orderId === orderA.orderId), Date.now() + 86400000).id, 'cancelled');
assert.equal(JSON.stringify(saved.find(o => o.orderId === orderB.orderId)), unchangedB);
// An old array snapshot must not discard newly saved independent records.
storage.set('caseup_orders', JSON.stringify([orderB]));
assert.equal(data.loadStoredOrders().length, 3);
storage.set('caseup_orders', '{malformed snapshot');
assert.equal(data.loadStoredOrders().length, 3);
const originalCrypto = Object.getOwnPropertyDescriptor(global, 'crypto');
Object.defineProperty(global, 'crypto', { configurable: true, value: { randomUUID: () => 'forced-collision' } });
try {
  const created = await Promise.all(Array.from({ length: 5 }, () => data.createStoredOrder(fixture)));
  assert.equal(new Set(created.map(o => o.orderId)).size, 5, 'collisions never replace orders');
  assert.equal(data.loadStoredOrders().length, 8);
} finally { Object.defineProperty(global, 'crypto', originalCrypto); }
const originalNavigator = Object.getOwnPropertyDescriptor(global, 'navigator');
let lockCalls = 0;
Object.defineProperty(global, 'navigator', { configurable: true, value: { locks: { request: async (name, callback) => { assert.equal(name, 'caseup-orders'); lockCalls++; return callback(); } } } });
try {
  const before = data.loadStoredOrders().length;
  await Promise.all([data.createStoredOrder(fixture), data.createStoredOrder(fixture)]);
  assert.equal(lockCalls, 2); assert.equal(data.loadStoredOrders().length, before + 2);
} finally { Object.defineProperty(global, 'navigator', originalNavigator); }
// Duplicate submit is locked, and a previous confirmation cannot hide a new cart.
hookValues[8] = orderB;
assert.ok(!render(Cart).includes('Đặt hàng thành công!'));
hookValues[8] = null; hookIndex = 0;
const doubleSubmit = findForm(Cart()).props.onSubmit;
const beforeDoubleSubmit = data.loadStoredOrders().length;
await Promise.all([doubleSubmit({ preventDefault() {} }), doubleSubmit({ preventDefault() {} })]);
assert.equal(data.loadStoredOrders().length, beforeDoubleSubmit + 1);
// Failed storage must not clear cart or claim success.
const originalSetItem = localStorage.setItem;
localStorage.setItem = () => { throw new Error('unavailable'); };
cleared = false; hookIndex = 0;
await findForm(Cart()).props.onSubmit({ preventDefault() {} });
assert.equal(cleared, false);
localStorage.setItem = originalSetItem;
console.log('PASS: exact A/B/cancel-A/C checkout flow, independent statuses, refresh/stale-snapshot recovery, forced ID collisions, concurrent creates, double-submit lock, storage failure, seven statuses, six filters, order detail and no timing UI.');

})().catch(error => { console.error(error); process.exitCode = 1; });
