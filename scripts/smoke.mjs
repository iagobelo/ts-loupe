/**
 * Runs the installed package with nothing but Node itself: no test runner, no
 * transpiler, no dev dependencies. It exists so `engines.node` states a floor
 * that is actually exercised rather than guessed, on Node versions too old to
 * run the dev toolchain.
 *
 * Expects `ts-loupe` to be installed in the current directory and this file to
 * be copied next to that `node_modules`.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const esm = await import('ts-loupe');
const cjs = require('ts-loupe');

class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `hi ${this.name}`;
  }
}

for (const [format, L] of [
  ['ESM', esm],
  ['CJS', cjs],
]) {
  for (const name of ['lens', 'prop', 'view', 'set', 'over', 'compose']) {
    assert.equal(typeof L[name], 'function', `${format}: ${name} is missing`);
  }

  assert.equal(L.prop('name').get({ name: 'Iago' }), 'Iago', `${format}: get`);

  const array = L.prop(1).set(99)([10, 20, 30]);
  assert.ok(Array.isArray(array), `${format}: array stayed an array`);
  assert.deepEqual(array, [10, 99, 30], `${format}: array contents`);

  const person = L.prop('name').set('Leon')(new Person('Iago'));
  assert.ok(person instanceof Person, `${format}: prototype preserved`);
  assert.equal(person.greet(), 'hi Leon', `${format}: prototype methods`);

  const deep = L.compose(L.prop('a'), L.prop('b'), L.prop('c'));
  assert.equal(deep.get({ a: { b: { c: 7 } } }), 7, `${format}: compose of three reads`);
  assert.deepEqual(
    deep.set(9)({ a: { b: { c: 7, keep: 1 } } }),
    { a: { b: { c: 9, keep: 1 } } },
    `${format}: compose of three preserves siblings`,
  );

  assert.throws(() => L.prop('x').set(1)(null), TypeError, `${format}: null throws`);
  assert.throws(() => L.compose(), /at least one lens/i, `${format}: empty compose throws`);

  console.log(`  ${format}: ok`);
}

console.log(`smoke passed on Node ${process.version}`);
