/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS loader compiles TypeScript fixtures without adding a test dependency. */
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
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  module._compile(result.outputText, filename);
};
const { products, services, accessories, saleProducts, allProducts } = require('../data/products.ts');
const { recommendSizes } = require('../data/size-rules.ts');
assert.deepEqual(products.slice(0,6).map(p => p.name), [
  'Bao bảo vệ iPad / Tablet 11 inch', 'Bao bảo vệ Laptop 13–13.3 inch',
  'Bao bảo vệ Laptop 14 inch', 'Bao bảo vệ Laptop 15.6 inch cho máy mỏng',
  'Bao bảo vệ Laptop 15.6–16 inch', 'Bao bảo vệ Laptop 17.3 inch'
]);
const { matchesProduct } = require('../data/product-search.ts');
for (const q of ['laptop','ipad','tablet','11 inch','13 inch','13.3 inch','14 inch','15.6 inch','16 inch','17.3 inch','móc khóa','phụ kiện','tag treo']) {
  assert.ok(saleProducts.some(p => matchesProduct(p, q)), q);
}
assert.equal(products.length, 10);
assert.equal(accessories.length, 6);
assert.equal(new Set(allProducts.map(p => p.id)).size, allProducts.length);
assert.ok(accessories.every(p => p.kind === 'accessory' && p.price === 29000 && p.category === 'Móc khóa / Phụ kiện'));
for (const p of allProducts) {
  assert.ok(p.gallery?.length > 0);
  for (const img of [p.image, ...p.gallery]) {
    assert.match(img, p.kind === 'accessory' ? /^\/products\/mockhoa_0[1-6]\.jpg$/ : /^\/products\/product_(?:0[1-9]|overview)\.jpg$/);
  }
}
for (const p of products.filter(p => p.priceConfirmed !== false)) assert.ok(p.price > 29000);
assert.ok(recommendSizes(25,19,1).every(p => p.kind === 'sleeve'));

assert.deepEqual(products.slice(0,4).map(p => p.price), [119000,119000,129000,139000]);
assert.deepEqual(products.slice(0,6).map(p => [p.maxHeight,p.maxWidth,p.maxThickness]), [[19,25,1],[22,32,2],[23,34,2],[25,36,2],[26,38,2.5],[28,41,3]]);
assert.equal(recommendSizes(34,23,1.8)[0].id, 3);
assert.equal(recommendSizes(36,25,2.4)[0].id, 5);
assert.equal(recommendSizes(25,36,2)[0].id, 4);
assert.equal(recommendSizes(36,25,2.01)[0].id, 5);
assert.equal(recommendSizes(38,26,2.5)[0].id, 5);
assert.equal(recommendSizes(38,26,2.51)[0].id, 6);
assert.equal(recommendSizes(41,28,3)[0].id, 6);
for (const values of [[42,29,2],[41,28,3.01],[-1,23,1],[NaN,23,1],[34,23,0]]) assert.equal(recommendSizes(...values).length, 0);
assert.equal(recommendSizes(36,25)[0].id,4);
for (const p of allProducts) for (const image of [p.image, ...(p.gallery || [])]) assert.ok(fs.existsSync(path.join(__dirname,'../public',image)), image);
assert.ok(services.every(p => p.price === 29000));
assert.ok(allProducts.every(p => p.priceConfirmed !== false));
assert.deepEqual(products.slice(4,6).map(p => p.price), [149000,159000]);
assert.equal(products.find(p => p.id === 5).image, '/products/product_07.jpg');
assert.equal(products.find(p => p.id === 6).image, '/products/product_04.jpg');
for (const file of ['size_table.jpg','bang_mau.jpg','bang_mau_nut.jpg']) assert.ok(fs.existsSync(path.join(__dirname,'../public/products',file)));
(async () => {
  const { POST } = require('../app/api/chat/route.ts');
  for (const [content,id] of [['Máy tôi 34 x 23 x 1.8 cm',3],['Máy 36 x 25 x 2.4 cm',5],['Máy 25 × 36 × 2 cm',4],['Máy 41 x 28 x 3 cm',6]]) {
    const response = await POST(new Request('http://localhost/api/chat',{ method:'POST', body:JSON.stringify({ messages:[{role:'user',content}] }) }));
    assert.equal(response.status,200);
    const body=await response.json();
    assert.deepEqual(body.recommendedProductIds,[id]);
    assert.ok(body.reply.includes(products.find(p => p.id === id).name));
    assert.ok(!/Sleeve/i.test(body.reply));
    if (id === 5 || id === 6) {
      assert.ok(body.reply.includes(products.find(p => p.id === id).price.toLocaleString('vi-VN')));
      assert.ok(!body.reply.includes('chờ xác nhận'));
    }
  }
  for (const [content,id] of [['Có thêu tên không?',7],['Có phụ kiện mua kèm không?',8],['Móc khóa bao nhiêu?',8],['Phụ kiện tag treo giá sao?',8]]) {
    const response = await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({messages:[{role:'user',content}]})}));
    const body = await response.json();
    assert.deepEqual(body.recommendedProductIds,[id]);
    assert.match(body.reply,/29.000/);
  }
  const followup = await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({messages:[{role:'user',content:'Máy 36 x 25 cm'},{role:'assistant',content:'Bạn cho biết độ dày?'},{role:'user',content:'Dày 2.4 cm'}]})}));
  assert.deepEqual((await followup.json()).recommendedProductIds,[5]);
  const provisional = await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({messages:[{role:'user',content:'Máy 36 x 25 cm'}]})}));
  assert.match((await provisional.json()).reply,/sơ bộ/);
  const bad = await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({messages:[{role:'user',content:23}]})}));
  assert.equal(bad.status,400);
  console.log('PASS: 17 catalog records, group-specific galleries, prices, search terms, size boundaries, chat accessory pricing and thickness history.');
})().catch(error => { console.error(error); process.exitCode=1; });
