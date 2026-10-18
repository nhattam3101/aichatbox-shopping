/* eslint-disable @typescript-eslint/no-require-imports -- Isolated DOM harness for shared dialog behavior. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
let effects = [];
class Element {
  constructor(parent = null) {
    this.parentElement = parent;
    this.children = [];
    this.inert = false;
    this.isConnected = true;
    parent?.children.push(this);
  }
  focus() { document.activeElement = this; }
  getClientRects() { return [1]; }
  querySelectorAll() { return this.children; }
  contains(element) { return element === this || this.children.some(child => child.contains(element)); }
  closest() { return this.inert ? this : this.parentElement?.closest() ?? null; }
}
global.HTMLElement = Element;
const listeners = new Set();
global.document = {
  body: Object.assign(new Element(), { style: { overflow: 'auto' } }),
  activeElement: null,
  addEventListener: (_, fn) => listeners.add(fn),
  removeEventListener: (_, fn) => listeners.delete(fn),
};
const load = Module._load;
Module._load = function(name, ...args) {
  if (name === 'react') return {
    useRef: current => ({ current }),
    useEffect: fn => effects.push(fn),
  };
  return load.call(this, name, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { useDialogFocus } = require('../components/useDialogFocus.ts');
function open(dialog, close) {
  effects = [];
  const ref = useDialogFocus(true, close);
  ref.current = dialog;
  const cleanups = effects.map(effect => effect()).filter(Boolean);
  return () => cleanups.forEach(cleanup => cleanup());
}
function key(key, shiftKey = false) {
  let stopped = false;
  const event = { key, shiftKey, preventDefault() {}, stopImmediatePropagation() { stopped = true; } };
  for (const listener of listeners) { listener(event); if (stopped) break; }
}
const background = new Element(document.body);
const trigger = new Element(background);
trigger.focus();
const layerA = new Element(document.body);
const dialogA = new Element(layerA);
const first = new Element(dialogA);
const last = new Element(dialogA);
let closedA = 0, closedB = 0;
const cleanupA = open(dialogA, () => closedA++);
assert.equal(background.inert, true);
assert.equal(document.body.style.overflow, 'hidden');
assert.equal(document.activeElement, first);
first.focus(); key('Tab', true); assert.equal(document.activeElement, last);
last.focus(); key('Tab'); assert.equal(document.activeElement, first);
const layerB = new Element(document.body);
const dialogB = new Element(layerB);
new Element(dialogB);
const cleanupB = open(dialogB, () => closedB++);
assert.equal(layerA.inert, true);
key('Escape');
assert.equal(closedA, 0); assert.equal(closedB, 1);
cleanupB();
assert.equal(layerA.inert, false);
assert.equal(background.inert, true);
assert.equal(document.activeElement, first);
assert.equal(document.body.style.overflow, 'hidden');
cleanupA();
assert.equal(background.inert, false);
assert.equal(document.activeElement, trigger);
assert.equal(document.body.style.overflow, 'auto');
assert.equal(listeners.size, 0);
console.log('PASS: dialog focus wrap, topmost Escape, inert background, stacked scroll lock and focus restoration.');
