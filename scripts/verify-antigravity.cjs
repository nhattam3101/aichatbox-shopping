/* eslint-disable @typescript-eslint/no-require-imports -- Exercise Canvas lifecycle in a deterministic browser fixture. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const originalLoad = Module._load;
let canvas, effect;
Module._load = function(request, ...args) {
  if (request === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }) };
  if (request === 'react') return { useRef: () => ({ current: canvas }), useEffect: fn => { effect = fn; } };
  return originalLoad.call(this, request, ...args);
};
require.extensions['.tsx'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
const Background = require('../components/AntigravityBackground.tsx').default;
for (const width of [375, 768, 1024, 1440]) {
  for (const reduced of [false, true]) {
    let frames = new Map(), next = 0, fills = 0, disconnected = 0;
    const listeners = new Map();
    const ctx = { setTransform() {}, clearRect() {}, beginPath() {}, roundRect() {}, arc() {}, fill() { fills++; } };
    canvas = { getContext: () => ctx, getBoundingClientRect: () => ({ width, height: 500 }) };
    global.window = { devicePixelRatio: 3 };
    global.document = { hidden: false, addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) };
    global.matchMedia = () => ({ matches: reduced, addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) });
    global.requestAnimationFrame = fn => { frames.set(++next, fn); return next; };
    global.cancelAnimationFrame = id => frames.delete(id);
    global.ResizeObserver = class { observe() {} disconnect() { disconnected++; } };
    global.IntersectionObserver = class { observe() {} disconnect() { disconnected++; } };
    const element = Background({ celebration: true });
    assert.equal(element.props['aria-hidden'], 'true');
    const cleanup = effect();
    assert.equal(canvas.width, width * 2, 'DPR capped at 2');
    if (reduced) assert.equal(frames.size, 0);
    else {
      for (let timestamp = 16; timestamp < 2400 && frames.size; timestamp += 16) {
        const callbacks = [...frames.values()]; frames.clear();
        for (const callback of callbacks) callback(timestamp);
        if (timestamp === 16) assert.equal(fills, width < 768 ? 10 : 24);
      }
      assert.equal(frames.size, 0, 'celebration stops after two seconds');
    }
    cleanup();
    assert.equal(frames.size, 0); assert.equal(listeners.size, 0); assert.equal(disconnected, 2);
  }
}
console.log('PASS: 375/768/1024/1440 container sizing, mobile counts, DPR cap, reduced motion, finite celebration and observer/listener/frame cleanup.');
