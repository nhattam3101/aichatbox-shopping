/* eslint-disable @typescript-eslint/no-require-imports -- Isolated client interaction harness, no network or browser dependencies. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
let slots = [], cursor = 0, effects = [], tree;
const react = {
  useRef(value) { const i = cursor++; return slots[i] ??= { current: value }; },
  useState(value) { const i = cursor++; if (!(i in slots)) slots[i] = value; return [slots[i], v => { slots[i] = typeof v === 'function' ? v(slots[i]) : v; }]; },
  useEffect(fn, deps) { const i = cursor++; if (!slots[i] || deps.some((d, j) => d !== slots[i].deps[j])) {
    effects.push(() => { slots[i]?.cleanup?.(); slots[i] = { deps, cleanup: fn() }; });
  } },
};
const load = Module._load;
Module._load = function(request, ...args) {
  if (request === 'react') return react;
  if (request === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
  if (request === 'next/image') return { __esModule: true, default: 'img' };
  return load.call(this, request.startsWith('@/') ? path.resolve(__dirname, '..', request.slice(2)) : request, ...args);
};
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
const Component = require('../components/AiMockupGenerator.tsx').default;
let props = { configuration: { productId: 1, sizeMode: 'standard', selectedColor: 'Beige', selectedButton: 'Baby Blue', embroidery: false, embroideryText: '', selectedAccessoryId: null }, valid: true, changeKey: '' };
function render() { cursor = 0; effects = []; tree = Component(props); effects.forEach(fn => fn()); return tree; }
function nodes(node = tree) {
  if (!node || typeof node !== 'object') return [];
  return [node, ...[node.props?.children].flat(Infinity).filter(child => child && typeof child === 'object').flatMap(child => nodes(child))];
}
const button = () => nodes().find(n => n.type === 'button');
let calls = 0, complete;
global.fetch = () => { calls++; return new Promise(resolve => { complete = resolve; }); };
(async () => {
  render(); assert.equal(calls, 0);
  const first = button().props.onClick();
  const second = button().props.onClick();
  assert.equal(calls, 1, 'double click submits exactly once');
  render(); assert.equal(button().props.disabled, true); assert.equal(tree.props['aria-busy'], true);
  complete({ ok: true, json: async () => ({ imageUrl: 'data:image/png;base64,dGVzdA==' }) });
  await Promise.all([first, second]); render();
  assert.equal(nodes().filter(n => n.type === 'img').length, 1);
  props = { ...props, configuration: { ...props.configuration, selectedColor: 'Đen' } }; render();
  assert.equal(nodes().filter(n => n.type === 'img').length, 0, 'stale image immediately hidden');
  assert.ok(JSON.stringify(tree).includes('Tùy chọn đã thay đổi'));
  const pending = button().props.onClick(); render();
  props = { ...props, changeKey: 'new selection during generation' }; render();
  complete({ ok: true, json: async () => ({ imageUrl: 'data:image/png;base64,dGVzdA==' }) });
  await pending; render(); assert.equal(nodes().filter(n => n.type === 'img').length, 0);
  const failed = button().props.onClick(); complete({ ok: false, status: 429, json: async () => ({}) }); await failed; render();
  assert.ok(JSON.stringify(tree).includes('Hệ thống tạo ảnh đã đạt giới hạn lượt dùng. Vui lòng thử lại sau.'));
  for (const status of [404, 500]) {
    const pending = button().props.onClick();
    complete({ ok: false, status, json: async () => ({ error: 'private error' }) });
    await pending; render();
    const { mockupErrors } = require('../data/mockup.ts');
    assert.ok(JSON.stringify(tree).includes(status === 404 ? mockupErrors.unavailable : mockupErrors.generation));
    assert.ok(!JSON.stringify(tree).includes('private error'));
  }
  assert.equal(button().props.disabled, false, 'can retry after failure');
  props = { ...props, valid: false }; render(); assert.equal(button().props.disabled, true);
  for (const slot of slots) slot?.cleanup?.();
  slots = [];
  console.log('PASS: no automatic calls, double-click lock, loading, result, stale changes, in-flight changes, rate-limit recovery, invalid dimensions.');
})().catch(error => { console.error(error); process.exitCode = 1; });
