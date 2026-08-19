import { describe, expect, it } from 'vitest';
import { compose, prop } from '../src/index.js';

type Inner = { c: number; siblingC: string };
type Middle = { b: Inner; siblingB: string };
type Outer = { a: Middle; siblingA: string };

const deep = (): Outer => ({
  a: { b: { c: 1, siblingC: 'keepC' }, siblingB: 'keepB' },
  siblingA: 'keepA',
});

const aLens = () => prop<Outer, 'a'>('a');
const bLens = () => prop<Middle, 'b'>('b');
const cLens = () => prop<Inner, 'c'>('c');

describe('compose with two lenses', () => {
  it('reads through both levels', () => {
    expect(compose(aLens(), bLens()).get(deep())).toEqual({ c: 1, siblingC: 'keepC' });
  });

  it('writes through both levels preserving siblings', () => {
    const result = compose(aLens(), bLens()).set({ c: 9, siblingC: 'newC' })(deep());

    expect(result).toEqual({
      a: { b: { c: 9, siblingC: 'newC' }, siblingB: 'keepB' },
      siblingA: 'keepA',
    });
  });
});

describe('compose with three lenses', () => {
  it('reads the innermost value rather than an intermediate object', () => {
    expect(compose(aLens(), bLens(), cLens()).get(deep())).toBe(1);
  });

  it('writes the innermost value preserving every sibling at every level', () => {
    const result = compose(aLens(), bLens(), cLens()).set(9)(deep());

    expect(result).toEqual({
      a: { b: { c: 9, siblingC: 'keepC' }, siblingB: 'keepB' },
      siblingA: 'keepA',
    });
  });

  it('does not mutate the input', () => {
    const source = deep();
    compose(aLens(), bLens(), cLens()).set(9)(source);

    expect(source).toEqual(deep());
  });
});

describe('compose with four lenses', () => {
  type L4 = { a: { b: { c: { d: number; keep: string } } } };

  it('reads and writes through four levels', () => {
    const source: L4 = { a: { b: { c: { d: 1, keep: 'k' } } } };
    const lens4 = compose(
      prop<L4, 'a'>('a'),
      prop<L4['a'], 'b'>('b'),
      prop<L4['a']['b'], 'c'>('c'),
      prop<L4['a']['b']['c'], 'd'>('d'),
    );

    expect(lens4.get(source)).toBe(1);
    expect(lens4.set(7)(source)).toEqual({ a: { b: { c: { d: 7, keep: 'k' } } } });
  });
});

describe('compose with a single lens', () => {
  it('behaves like the lens itself', () => {
    const only = compose(aLens());

    expect(only.get(deep())).toEqual(deep().a);
    expect(only.set({ b: { c: 5, siblingC: 'x' }, siblingB: 'y' })(deep())).toEqual({
      a: { b: { c: 5, siblingC: 'x' }, siblingB: 'y' },
      siblingA: 'keepA',
    });
  });
});

describe('compose with no lenses', () => {
  it('throws a descriptive error instead of failing later on undefined', () => {
    const composeAny = compose as unknown as () => unknown;

    expect(() => composeAny()).toThrow(TypeError);
    expect(() => composeAny()).toThrow(/at least one lens/i);
  });
});

describe('compose over array indices', () => {
  type Basket = { items: number[] };

  it('writes into a nested array preserving the array type', () => {
    const source: Basket = { items: [1, 2, 3] };
    const lens = compose(prop<Basket, 'items'>('items'), prop<number[], 1>(1));
    const result = lens.set(99)(source);

    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items).toEqual([1, 99, 3]);
    expect(source.items).toEqual([1, 2, 3]);
  });
});

describe('composed lens laws', () => {
  const source = deep();
  const composed = compose(aLens(), bLens(), cLens());

  it('get after set returns the written value (set-get)', () => {
    expect(composed.get(composed.set(42)(source))).toBe(42);
  });

  it('set of the current value is a no-op (get-set)', () => {
    expect(composed.set(composed.get(source))(source)).toEqual(source);
  });

  it('the last set wins (set-set)', () => {
    expect(composed.set(2)(composed.set(1)(source))).toEqual(composed.set(2)(source));
  });
});
