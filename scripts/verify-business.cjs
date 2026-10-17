/* eslint-disable @typescript-eslint/no-require-imports -- Verify confirmed business boundaries and actual cart actions. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const React = require('react');
const load = Module._load;
let slots = [], cursor = 0, effects = [];
Module._load = function(request, ...args) {
  if (request === 'react') return { ...React, createContext: () => ({ Provider: 'provider' }), useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; }, useEffect(fn, deps) { const i = cursor++; if (!slots[i] || deps.some((d, j) => d !== slots[i].deps[j])) { effects.push(() => { slots[i]?.cleanup?.(); slots[i] = { deps, cleanup: fn() }; }); } } };
  if (request === '@/components/CartToast') return { __esModule: true, default: () => null };
  return load.call(this, request.startsWith('@/') ? path.resolve(__dirname, '..', request.slice(2)) : request, ...args);
};
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
const { shippingEligibility, matchesPriceRange, customSizeQuote, CUSTOM_PRODUCT_ID } = require('../data/business.ts');
const { returningCustomerOffer, evaluateVoucher } = require('../data/vouchers.ts');
const { fabricColors } = require('../data/fabric-colors.ts');
const { products, customMadeProduct } = require('../data/products.ts');
const { productSpecifications } = require('../data/product-specs.ts');
const { validateCustomDimensions } = require('../data/size-validation.ts');
const { recommendSizes } = require('../data/size-rules.ts');
const { validateMockup } = require('../data/mockup.ts');
for (const [subtotal, percentage] of [[0, 0], [1200, 0], [119000, 40], [299000, 100], [300000, 100], [476000, 100], [-1000, 0]]) {
  assert.equal(shippingEligibility(subtotal).progress, percentage, 'shipping percentage is rounded and clamped');
}
for (const [subtotal, free] of [[119000, false], [299000, false], [300000, true], [350000, true]]) {
  assert.equal(shippingEligibility(subtotal).free, free);
  assert.equal(shippingEligibility(subtotal).remaining, Math.max(0, 300000 - subtotal));
  assert.equal(evaluateVoucher('FREESHIP', subtotal).success, free);
}
for (const [price, band] of [[119000, 'under120'], [120000, '120to140'], [129000, '120to140'], [139000, '120to140'], [140000, '120to140'], [149000, 'above140'], [159000, 'above140']]) {
  for (const range of ['under120', '120to140', 'above140']) assert.equal(matchesPriceRange(price, range), range === band);
}
assert.equal(returningCustomerOffer.discountPercent, .05); assert.equal(returningCustomerOffer.code, null);
for (const retired of ['CASEUP10', 'VIP20']) assert.equal(evaluateVoucher(retired, 500000).success, false);
assert.equal(fabricColors.length, 12); assert.equal(new Set(fabricColors).size, 12);
for (const product of products) assert.deepEqual(product.colors, fabricColors);
for (const product of products.slice(0, 6)) {
  assert.equal(product.material, undefined); assert.equal(product.weight, undefined);
  assert.ok(!productSpecifications(product).some(row => ['Chất liệu cấu tạo', 'Trượt nước', 'Trọng lượng'].includes(row.label)));
}
assert.equal(validateCustomDimensions('32', '22', '').isValid, false);
assert.equal(validateCustomDimensions('32', '22', '2').isValid, true);
assert.deepEqual(recommendSizes(32, 22), []);
assert.ok(recommendSizes(32, 22, 2).every(product => !product.madeToMeasure));
assert.equal(customMadeProduct.id, CUSTOM_PRODUCT_ID); assert.equal(customMadeProduct.price, 149000);
assert.equal(customSizeQuote({ lengthCm: 32, widthCm: 22, thicknessCm: 2 }).price, 149000);
assert.equal(customSizeQuote({ lengthCm: 45, widthCm: 30, thicknessCm: 4 }).surcharge, null);
const config = { productId: CUSTOM_PRODUCT_ID, sizeMode: 'custom', customDimensions: { lengthCm: 32, widthCm: 22, thicknessCm: 2 }, selectedColor: 'Hồng phấn', selectedButton: 'Kem', embroidery: true, embroideryText: 'Uyen', selectedAccessoryId: 8 };
assert.ok(validateMockup(config)); assert.equal(validateMockup({ ...config, sizeMode: 'standard' }), null);
assert.equal(validateMockup({ ...config, productId: 2 }), null);
const map = new Map(); global.window = {};
global.localStorage = { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) };
global.alert = () => {};
const { CartProvider } = require('../components/CartContext.tsx');
async function renderCart() { cursor = 0; effects = []; const value = CartProvider({ children: null }).props.value; effects.forEach(fn => fn()); await Promise.resolve(); return value; }
(async () => {
  await renderCart(); let cart = await renderCart();
  cart.addToCart({ ...customMadeProduct, selectedColor: 'Hồng phấn' }, false);
  cart = await renderCart(); assert.equal(cart.cart.length, 0, 'custom product requires valid dimensions');
  cart.addToCart({ ...customMadeProduct, quantity: 2, sizeMode: 'custom', customDimensions: config.customDimensions, selectedColor: config.selectedColor, selectedButton: config.selectedButton, embroidery: true, embroideryText: 'Uyen' }, false);
  cart = await renderCart(); assert.equal(cart.cart.length, 1); assert.equal(cart.cart[0].price, 149000); assert.equal(cart.totalPrice, 298000);
  for (const key of ['selectedColor', 'selectedButton', 'customDimensions', 'embroideryText']) assert.deepEqual(cart.cart[0][key], config[key]);
  assert.equal(cart.applyCoupon('FREESHIP').success, false);
  const saved = JSON.parse(map.get('cart')); assert.equal(saved[0].id, CUSTOM_PRODUCT_ID); assert.equal(saved[0].embroideryText, 'Uyen');
  cart.addToCart({ ...products[0], selectedColor: 'Baby Blue' }, false); cart = await renderCart();
  assert.equal(cart.applyCoupon('FREESHIP').success, true); assert.equal(cart.applyCoupon('CASEUP10').success, false);
  cart = await renderCart(); assert.equal(cart.discountAmount, 0);
  // Reload persisted custom dimensions/text and migrate legacy custom options to the separate product.
  slots.forEach(slot => slot?.cleanup?.()); slots = [];
  map.set('cart', JSON.stringify([{ ...saved[0], id: 2, price: 119000 }]));
  await renderCart(); cart = await renderCart();
  assert.equal(cart.cart[0].id, CUSTOM_PRODUCT_ID); assert.equal(cart.cart[0].price, 149000); assert.equal(cart.cart[0].embroideryText, 'Uyen');
  for (const directory of ['app', 'components', 'data']) for (const file of fs.readdirSync(path.resolve(directory), { recursive: true })) {
    if (!/\.(ts|tsx)$/.test(file)) continue;
    const source = fs.readFileSync(path.resolve(directory, file), 'utf8');
    assert.ok(!/CASEUP10|VIP20|không cần lý do|[Cc]hống nước|[Dd]a cao cấp|under200|Dưới 200k|đơn đầu/i.test(source), `Retired business copy in ${directory}/${file}`);
  }
  console.log('PASS: shipping 119/299/300/350k, all price-band boundaries, retired voucher rejection, returning 5% without invented code, 12 official colors, required measurements, unsupported specs omitted, separate 149k custom product, cart persistence/migration and AI validation.');
})().catch(error => { console.error(error); process.exitCode = 1; });
