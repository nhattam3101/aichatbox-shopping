/* eslint-disable @typescript-eslint/no-require-imports -- Verify local demo persistence without a browser. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) { return resolve.call(this, request.startsWith('@/') ? path.resolve(__dirname, '..', request.slice(2)) : request, ...args); };
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const map = new Map();
global.window = {};
global.localStorage = { get length() { return map.size; }, key: i => [...map.keys()][i] ?? null, getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) };
const { addStoredOrder, loadStoredOrders, demoCompletionTime } = require('../data/orders.ts');
const { DEMO_ORDER_POLICY } = require('../data/demo-orders.ts');
const now = 1800000000000;
const base = { orderId: 'base', demo: true, createdAt: now - 600000, items: [{ id: 1, name: 'Test', image: '/products/product_01.jpg', price: 119000, quantity: 1 }], total: 119000, totalQuantity: 1, customerName: 'Test', phone: '', address: '', note: '', paymentMethod: 'cod', createdAtDisplay: '' };
const fixtures = [
  { ...base, orderId: 'old', status: 'delivered', completedAt: now - 180000 },
  { ...base, orderId: 'recent', status: 'delivered', completedAt: now - 40000 },
  { ...base, orderId: 'boundary', status: 'delivered', completedAt: now - 120000 },
  { ...base, orderId: 'shipping', createdAt: now - 240000 },
  { ...base, orderId: 'processing', status: 'preparing' },
  { ...base, orderId: 'cancelled', status: 'cancelled', completedAt: now - 600000 },
  { ...base, orderId: 'real', demo: false, status: 'delivered', completedAt: now - 600000 },
  { ...base, orderId: 'legacy-auto', demo: undefined, createdAt: now - 420000 },
  { ...base, orderId: 'external-status', demo: undefined, status: 'delivered' },
  { ...base, orderId: 'cancel-old', status: 'cancelled', cancelledAt: now - 180000 },
  { ...base, orderId: 'cancel-boundary', status: 'cancelled', cancelledAt: now - 120000 },
  { ...base, orderId: 'cancel-recent', status: 'cancelled', cancelledAt: now - 40000 },
  { ...base, orderId: 'cancel-real', demo: false, status: 'cancelled', cancelledAt: now - 180000 },
  { ...base, orderId: 'cancel-external', demo: undefined, status: 'cancelled', cancelledAt: now - 180000 },
];
fixtures.forEach(addStoredOrder);
map.set('caseup_demo_order', JSON.stringify(fixtures[0]));
const expected = ['recent', 'shipping', 'processing', 'cancelled', 'real', 'external-status', 'cancel-recent', 'cancel-real', 'cancel-external'].sort();
assert.deepEqual(loadStoredOrders(now).map(order => order.orderId).sort(), expected);
assert.deepEqual(loadStoredOrders(now).map(order => order.orderId).sort(), expected, 'refresh cannot resurrect expired orders');
assert.deepEqual(JSON.parse(map.get('caseup_orders')).map(order => order.orderId).sort(), expected);
for (const id of ['old', 'boundary', 'legacy-auto', 'cancel-old', 'cancel-boundary']) assert.equal(map.has(`caseup_order_record:${id}`), false);
assert.equal(map.has('caseup_demo_order'), false);
assert.equal(demoCompletionTime(fixtures[5], now), null, 'cancelled state is protected');
assert.equal(demoCompletionTime(fixtures[6], now), null, 'real orders are protected');
map.clear(); addStoredOrder({ ...base, orderId: 'automatic', createdAt: now - 419999 });
assert.equal(loadStoredOrders(now).length, 1, 'one millisecond before retention boundary');
assert.equal(loadStoredOrders(now + 1).length, 0, 'exact derived boundary');
assert.equal(loadStoredOrders(now + 2).length, 0);
map.clear(); addStoredOrder({ ...base, orderId: 'cancel-exact', status: 'cancelled', cancelledAt: now - 119999 });
assert.equal(loadStoredOrders(now).length, 1, 'cancelled one millisecond before boundary');
assert.equal(loadStoredOrders(now + 1).length, 0, 'cancelled exact retention boundary');
assert.equal(loadStoredOrders(now + 2).length, 0, 'cancelled remains removed after reload');
assert.equal(DEMO_ORDER_POLICY.finalStateRetentionMs, 120000);
assert.ok(DEMO_ORDER_POLICY.refreshMs >= 10000 && DEMO_ORDER_POLICY.refreshMs <= 15000);
console.log('PASS: completed/cancelled demo retention boundaries, reload persistence, independent mixed orders, recovery removal, active/real/unknown-timestamp protection.');
