/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS script tests TypeScript fixtures */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  if (request.startsWith('@/')) request = path.resolve(__dirname, '..', request.slice(2));
  return originalResolve.call(this, request, ...args);
};

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  });
  module._compile(result.outputText, filename);
};

// 1. Verify Product 4
const { products } = require('../data/products.ts');
const prod4 = products.find(p => p.id === 4);
assert.equal(prod4.name, 'Bao bảo vệ Laptop 15.6 inch');
assert.equal(prod4.price, 139000);
console.log('✓ Task 1: Product 4 name is "Bao bảo vệ Laptop 15.6 inch"');

// 2. Verify Size Validation Rules
const { validateCustomDimensions, isValidDecimalString } = require('../data/size-validation.ts');

// Valid cases
assert.ok(isValidDecimalString('32'));
assert.ok(isValidDecimalString('32.5'));
assert.ok(isValidDecimalString('22'));
assert.ok(isValidDecimalString('2'));
assert.ok(isValidDecimalString('2.4'));

// Invalid cases
assert.ok(!isValidDecimalString('0'));
assert.ok(!isValidDecimalString('-1'));
assert.ok(!isValidDecimalString('abc'));
assert.ok(!isValidDecimalString('32.555'));
assert.ok(!isValidDecimalString('1e2'));

// Length < 10 or > 50
const lenLow = validateCustomDimensions('8', '22', '2');
assert.equal(lenLow.isValid, false);
assert.equal(lenLow.lengthError, 'Chiều dài phải nằm trong khoảng 10–50 cm.');

const lenHigh = validateCustomDimensions('55', '22', '2');
assert.equal(lenHigh.isValid, false);
assert.equal(lenHigh.lengthError, 'Chiều dài phải nằm trong khoảng 10–50 cm.');

// Width < 7 or > 40
const widLow = validateCustomDimensions('32', '5', '2');
assert.equal(widLow.isValid, false);
assert.equal(widLow.widthError, 'Chiều rộng phải nằm trong khoảng 7–40 cm.');

const widHigh = validateCustomDimensions('32', '45', '2');
assert.equal(widHigh.isValid, false);
assert.equal(widHigh.widthError, 'Chiều rộng phải nằm trong khoảng 7–40 cm.');

// Thickness < 0.3 or > 6
const thkLow = validateCustomDimensions('32', '22', '0.1');
assert.equal(thkLow.isValid, false);
assert.equal(thkLow.thicknessError, 'Độ dày phải nằm trong khoảng 0.3–6 cm.');

const thkHigh = validateCustomDimensions('32', '22', '7');
assert.equal(thkHigh.isValid, false);
assert.equal(thkHigh.thicknessError, 'Độ dày phải nằm trong khoảng 0.3–6 cm.');

// Length <= Width
const lenSmaller = validateCustomDimensions('20', '25', '2');
assert.equal(lenSmaller.isValid, false);
assert.equal(lenSmaller.generalError, 'Chiều dài nên lớn hơn chiều rộng. Vui lòng kiểm tra lại kích thước máy.');

const lenEqual = validateCustomDimensions('25', '25', '2');
assert.equal(lenEqual.isValid, false);
assert.equal(lenEqual.generalError, 'Chiều dài nên lớn hơn chiều rộng. Vui lòng kiểm tra lại kích thước máy.');

// Missing values
const missing = validateCustomDimensions('', '20', '2');
assert.equal(missing.isValid, false);
assert.equal(missing.generalError, 'Vui lòng nhập đầy đủ kích thước máy.');

// Valid case
const valid = validateCustomDimensions('32.5', '22', '2');
assert.equal(valid.isValid, true);
assert.deepEqual(valid.dimensions, { lengthCm: 32.5, widthCm: 22, thicknessCm: 2 });
console.log('✓ Task 2: Custom dimensions validation & error messages verified');

// 3. Verify Cart Persistence & Variant Separation
const { sameCartVariant, cartVariantKey } = require('../data/customization.ts');
const standardItem = { id: 4, selectedColor: 'Đen da bò', selectedButton: 'Baby Blue', embroidery: false };
const customItemA = { id: 4, selectedColor: 'Đen da bò', selectedButton: 'Baby Blue', embroidery: false, sizeMode: 'custom', customDimensions: { lengthCm: 32, widthCm: 22, thicknessCm: 2 } };
const customItemB = { id: 4, selectedColor: 'Đen da bò', selectedButton: 'Baby Blue', embroidery: false, sizeMode: 'custom', customDimensions: { lengthCm: 34, widthCm: 24, thicknessCm: 2 } };
const customItemACopy = { id: 4, selectedColor: 'Đen da bò', selectedButton: 'Baby Blue', embroidery: false, sizeMode: 'custom', customDimensions: { lengthCm: 32, widthCm: 22, thicknessCm: 2 } };

assert.ok(!sameCartVariant(standardItem, customItemA), 'Standard and custom items should not merge');
assert.ok(!sameCartVariant(customItemA, customItemB), 'Different custom dimensions of same product should not merge');
assert.ok(sameCartVariant(customItemA, customItemACopy), 'Same custom dimensions should match');
assert.notEqual(cartVariantKey(customItemA), cartVariantKey(customItemB), 'Different custom dimensions have different keys');
assert.notEqual(cartVariantKey(standardItem), cartVariantKey(customItemA), 'Standard and custom have different keys');
console.log('✓ Task 3: Cart custom dimensions separation & persistence verified');

// 4. Verify Return Policy Asset
const policyAsset = path.join(__dirname, '../public/products/chinh_sach_doi_trr.jpg');
assert.ok(fs.existsSync(policyAsset), 'Return policy asset exists');
console.log('✓ Task 6: Return policy image asset exists at /products/chinh_sach_doi_trr.jpg');

// 5. Verify Contact Info
const { contact } = require('../data/contact.ts');
assert.equal(contact.location, 'TP. Hồ Chí Minh');
assert.equal(contact.phone, '+84 77 3543246');
assert.equal(contact.email, 'support@caseup.vn');
assert.equal(contact.supportHours, '8:00 – 22:00 tất cả các ngày');
console.log('✓ Task 7: Contact information strictly verified');

console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
