import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * The published artifacts are not the same program as `src`: they go through
 * `tsc` and, for the browser build, through Rollup and Terser. v0.1.2 shipped a
 * bundle whose `prop('__proto__')` silently dropped the write while the source
 * kept it, and no test could see that because every test ran against `src`.
 * These tests run the built files instead.
 */

type Loupe = typeof import('../../src/index.js');

const root = new URL('../../', import.meta.url);
const require = createRequire(import.meta.url);

const loadUmdInSandbox = (file: string): Loupe => {
  const code = readFileSync(fileURLToPath(new URL(file, root)), 'utf8');
  // A bare sandbox: no `exports`, no `module`, no `define`, so the UMD wrapper
  // takes its browser branch and must attach itself to the global object.
  const sandbox: Record<string, unknown> = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  return sandbox['ts-loupe'] as Loupe;
};

const formats: { name: string; load: () => Promise<Loupe> | Loupe }[] = [
  { name: 'ESM build', load: () => import('../../dist/esm/index.js') as Promise<Loupe> },
  { name: 'CJS build', load: () => require('../../dist/cjs/index.js') as Loupe },
  { name: 'UMD build', load: () => loadUmdInSandbox('dist/index.umd.js') },
  { name: 'UMD minified build', load: () => loadUmdInSandbox('dist/index.umd.min.js') },
];

describe.each(formats)('$name', ({ load }) => {
  let L: Loupe;

  beforeAll(async () => {
    L = await load();
  });

  it('exposes every public named export', () => {
    expect(Object.keys(L).toSorted()).toEqual(
      expect.arrayContaining(['compose', 'lens', 'over', 'prop', 'set', 'view']),
    );
  });

  it('has no default export, so the CDN global stays a callable namespace', () => {
    expect((L as unknown as Record<string, unknown>)['default']).toBeUndefined();
  });

  it('reads and writes a property', () => {
    expect(L.prop('name').get({ name: 'Len' })).toBe('Len');
    expect(L.prop('name').set('Leon')({ name: 'Len', age: 1 })).toEqual({ name: 'Leon', age: 1 });
  });

  it('returns a real array when writing an index', () => {
    const result = L.prop(1).set(99)([10, 20, 30]);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([10, 99, 30]);
  });

  it('preserves the prototype of class instances', () => {
    class Person {
      constructor(public name: string) {}
      greet(): string {
        return `hi ${this.name}`;
      }
    }

    const result = L.prop('name').set('Leon')(new Person('Iago'));

    expect(result).toBeInstanceOf(Person);
    expect(result.greet()).toBe('hi Leon');
  });

  it('keeps a __proto__ write as an own property without polluting Object.prototype', () => {
    const protoLens = L.prop('__proto__' as never) as unknown as {
      set: (value: unknown) => (data: object) => Record<string, unknown>;
    };
    const result = protoLens.set({ polluted: 1 })({ x: 1 });

    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true);
    expect(result['__proto__']).toEqual({ polluted: 1 });
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('composes three lenses without corrupting the intermediate levels', () => {
    type Inner = { c: number; keepC: string };
    type Middle = { b: Inner; keepB: string };
    type Outer = { a: Middle; keepA: string };

    const composed = L.compose(
      L.prop<Outer, 'a'>('a'),
      L.prop<Middle, 'b'>('b'),
      L.prop<Inner, 'c'>('c'),
    );
    const source: Outer = { a: { b: { c: 1, keepC: 'c' }, keepB: 'b' }, keepA: 'a' };

    expect(composed.get(source)).toBe(1);
    expect(composed.set(9)(source)).toEqual({
      a: { b: { c: 9, keepC: 'c' }, keepB: 'b' },
      keepA: 'a',
    });
  });

  it('throws when composing nothing', () => {
    expect(() => (L.compose as unknown as () => unknown)()).toThrow(/at least one lens/i);
  });

  it('throws instead of fabricating an object from null', () => {
    const nullish = null as unknown as { name: string };

    // Matched by message, not by `instanceof`: the UMD build runs inside a `vm`
    // realm, so its TypeError is not the host realm's TypeError.
    expect(() => L.prop<{ name: string }, 'name'>('name').set('x')(nullish)).toThrow(
      /Cannot set property name of null/,
    );
  });
});

describe('CDN contract', () => {
  it('attaches itself to the exact global name v0.x used', () => {
    const code = readFileSync(fileURLToPath(new URL('dist/index.umd.js', root)), 'utf8');
    const sandbox: Record<string, unknown> = {};
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);

    expect(sandbox['ts-loupe']).toBeTypeOf('object');
  });
});
