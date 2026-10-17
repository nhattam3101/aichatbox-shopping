/* eslint-disable @typescript-eslint/no-require-imports -- Test TypeScript route with a mocked paid API. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.resolve(__dirname, '..', request.slice(2)) : request, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);

let mode = 'success';
let calls = 0;
const load = Module._load;
Module._load = function(request, ...args) {
  if (request === '@google/genai') return { GoogleGenAI: class {
    models = { generateContent: async input => {
      calls++;
      assert.equal(input.model, 'gemini-3.1-flash-image');
      assert.equal(input.config.candidateCount, 1);
      assert.equal(input.config.imageConfig.imageSize, '1K');
      assert.ok(input.config.abortSignal instanceof AbortSignal);
      assert.ok(input.contents[0].parts[1].inlineData.data.length > 0);
      if (mode === 'rate') throw Object.assign(new Error('private error'), { status: 429 });
      if (mode === 'timeout') throw Object.assign(new Error('private error'), { name: 'TimeoutError' });
      if (mode === 'unsupported') throw Object.assign(new Error('private error'), { status: 404 });
      if (mode === 'server') throw Object.assign(new Error('private error'), { status: 500 });
      if (mode === 'empty') return { candidates: [] };
      return { candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: 'dGVzdA==' } }] } }] };
    } };
  } };
  return load.call(this, request, ...args);
};
const { POST } = require('../app/api/generate-mockup/route.ts');
const { products, accessories } = require('../data/products.ts');
const { buttonOptions } = require('../data/customization.ts');
const { validateMockup, mockupPrompt } = require('../data/mockup.ts');
const product = products.find(p => p.colors.includes('Xanh pastel'));
// The catalog has no pink sleeve fabric: exercise actual supported fabric options.
const base = { productId: product.id, sizeMode: 'standard', selectedColor: product.colors[0], selectedButton: buttonOptions[0].name,
  embroidery: false, embroideryText: '', selectedAccessoryId: null };
const request = body => new Request('http://localhost/api/generate-mockup', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) });

(async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY;
    assert.equal((await POST(request(base))).status, 503);
    assert.equal(calls, 0);
    process.env.GEMINI_API_KEY = 'test-only-placeholder';
    for (const config of [base,
      { ...base, selectedButton: buttonOptions[3].name, embroidery: true, embroideryText: 'Uyen' },
      { ...base, sizeMode: 'custom', customDimensions: { lengthCm: 32.5, widthCm: 22, thicknessCm: 2 }, embroidery: true, embroideryText: 'An' },
      { ...base, selectedAccessoryId: accessories[0].id }]) {
      assert.ok(validateMockup(config));
      const response = await POST(request(config));
      assert.equal(response.status, 200);
      assert.match((await response.json()).imageUrl, /^data:image\/png;base64,/);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    }
    assert.match(mockupPrompt(base), /Do not add any lettering/);
    const before = calls;
    for (const bad of [{ ...base, productId: 7 }, { ...base, selectedColor: 'arbitrary prompt' },
      { ...base, selectedAccessoryId: 999 }, { ...base, embroideryText: 'x'.repeat(16) },
      { ...base, sizeMode: 'custom', customDimensions: { lengthCm: 2, widthCm: 22, thicknessCm: 2 } }]) {
      assert.equal((await POST(request(bad))).status, 400);
    }
    assert.equal((await POST(request('not json'))).status, 400);
    assert.equal((await POST(request('x'.repeat(4097)))).status, 413);
    assert.equal(calls, before);
    for (mode of ['rate', 'timeout', 'unsupported', 'server', 'empty']) {
      const response = await POST(request(base));
      assert.equal(response.status, mode === 'rate' ? 429 : mode === 'unsupported' ? 404 : 500);
      const body = await response.json();
      const { mockupErrors } = require('../data/mockup.ts');
      assert.equal(body.error, mode === 'rate' ? mockupErrors.quota : mode === 'unsupported' ? mockupErrors.unavailable : mockupErrors.generation);
      assert.ok(!JSON.stringify(body).includes('private error'));
    }
    console.log('PASS: standard, embroidery/button, custom dimensions, accessory, missing key, validation, payload limit, rate limit, timeout, unsupported model, empty image; no paid calls.');
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
