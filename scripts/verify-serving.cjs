/* eslint-disable @typescript-eslint/no-require-imports -- Production HTTP smoke checks; start the app first. */
const assert = require('node:assert/strict');
const base = process.argv[2] ?? 'http://localhost:3001';
(async () => {
  for (const route of ['/', '/orders', '/vouchers', '/notifications', '/custom', '/cart', '/products', '/products/18', '/size-guide']) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type'), /text\/html/);
  }
  for (const name of ['ad5', 'ad6', 'done_product']) {
    for (const route of [`/products/${name}.png`, `/_next/image?url=%2Fproducts%2F${name}.png&w=640&q=75`]) {
      const response = await fetch(`${base}${route}`);
      assert.equal(response.status, 200, route);
      assert.match(response.headers.get('content-type'), /^image\//);
      assert.ok((await response.arrayBuffer()).byteLength > 0);
    }
  }
  console.log('PASS: homepage, orders, account pages, custom/cart/catalog/size-guide routes; approved promotion images and the success illustration load through original and optimized image URLs.');
})().catch(error => { console.error(error); process.exitCode = 1; });
