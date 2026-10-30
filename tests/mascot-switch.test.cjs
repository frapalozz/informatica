/* Run: node --test tests/mascot-switch.test.cjs
 * No Jekyll or browser dependencies required. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function boot(initialPet) {
  const scripts = [];
  const body = [];
  const saved = { 'informatica-mascot': initialPet };
  let reloads = 0;

  function element(tag) {
    const handlers = new Map();
    return {
      tag, children: [], attributes: {}, dataset: {}, src: '', async: true,
      setAttribute(k, v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k] || null; },
      appendChild(child) { this.children.push(child); return child; },
      addEventListener(name, cb) { handlers.set(name, cb); },
      fire(name) { handlers.get(name)?.(); },
    };
  }
  const attributes = {
    'data-cat-script': '/assets/js/assistente.js',
    'data-dog-script': '/assets/js/mascot-dog.js',
    'data-banter-script': '/assets/js/buddy-banter.js',
    'data-dati': '/assistente.json',
    'data-nome': 'Bit',
    'data-chiacchiere': 'true',
  };
  const document = {
    currentScript: { getAttribute: name => attributes[name] || null },
    createElement: element,
    createTextNode: text => ({ text }),
    body: { appendChild(node) { body.push(node); if (node.tag === 'script') scripts.push(node); } },
  };
  const localStorage = {
    getItem: key => saved[key] || null,
    setItem: (key, value) => { saved[key] = value; },
  };
  const window = { location: { reload() { reloads++; } } };
  vm.runInNewContext(read('assets/js/mascot-choice.js'), { document, window, localStorage, sessionStorage: localStorage });
  const controls = body.find(node => node.tag === 'nav').children.filter(node => node.tag === 'button');
  return { scripts, controls, saved, get reloads() { return reloads; } };
}

test('Cat is the default and runs the original Bit controller only', () => {
  const site = boot('cat');
  assert.deepEqual(site.scripts.map(s => s.src), ['/assets/js/assistente.js']);
  assert.equal(site.scripts[0].attributes['data-nome'], 'Bit');
  assert.equal(site.controls.find(b => b.dataset.mascot === 'cat').attributes['aria-pressed'], 'true');
});

test('Dog loads the SAME Bit controller with Buddy skin, then only the jokes adapter', () => {
  const site = boot('dog');
  assert.deepEqual(site.scripts.map(s => s.src), ['/assets/js/buddy-banter.js']);
  site.scripts[0].fire('load');
  assert.equal(site.scripts[1].src, '/assets/js/assistente.js');
  assert.equal(site.scripts[1].attributes['data-mascot'], 'dog');
  assert.equal(site.scripts[1].attributes['data-nome'], 'Buddy');
  site.scripts[1].fire('load');
  assert.equal(site.scripts[2].src, '/assets/js/mascot-dog.js');
  assert.equal(site.scripts.filter(s => s.src.endsWith('/assistente.js')).length, 1);
});

test('Switching pets persists choice and reloads once', () => {
  const site = boot('cat');
  site.controls.find(b => b.dataset.mascot === 'dog').fire('click');
  assert.equal(site.saved['informatica-mascot'], 'dog');
  assert.equal(site.reloads, 1);
});

test('Dog has no independent movement controller', () => {
  const engine = read('assets/js/assistente.js');
  const adapter = read('assets/js/mascot-dog.js');
  assert.match(engine, /var isDog =/);
  assert.match(engine, /walker = startWalker\(\)/);
  assert.match(engine, /function jumpTo\(p, now, opts\)/);
  assert.match(engine, /function decide\(now, p\)/);
  assert.doesNotMatch(adapter, /function (?:animate|routeFor|rebuild)\(/);
  for (const file of ['assets/js/assistente.js', 'assets/js/mascot-dog.js', 'assets/js/mascot-choice.js'])
    assert.doesNotThrow(() => new vm.Script(read(file)), file);
});
