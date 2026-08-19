import { describe, expect, it } from 'vitest';
import { prop } from '../src/index.js';

type User = { name: string; age: number };
type Pocket = { money: number; cards: number };

describe('prop', () => {
  it('builds a lens exposing get and set', () => {
    const nameLens = prop<User, 'name'>('name');

    expect(typeof nameLens.get).toBe('function');
    expect(typeof nameLens.set).toBe('function');
  });

  it('reads the focused property', () => {
    expect(prop('name').get({ name: 'Len', age: 1 })).toBe('Len');
  });

  it('writes the focused property, preserving siblings', () => {
    expect(prop('money').set(1000)({ money: 3213, cards: 2 } satisfies Pocket)).toEqual({
      money: 1000,
      cards: 2,
    });
  });

  it('does not mutate the input', () => {
    const user: User = { name: 'Len', age: 1 };
    prop('name').set('Leon')(user);

    expect(user).toEqual({ name: 'Len', age: 1 });
  });

  it('reads a missing property as undefined', () => {
    const partial = { age: 1 } as unknown as User;

    expect(prop<User, 'name'>('name').get(partial)).toBeUndefined();
  });

  it('adds a missing property on write', () => {
    const partial = { age: 1 } as unknown as User;

    expect(prop<User, 'name'>('name').set('Leon')(partial)).toEqual({ age: 1, name: 'Leon' });
  });

  it('focuses symbol keys', () => {
    const tag = Symbol('tag');
    const source = { [tag]: 'a', other: 1 };

    expect(prop(tag).get(source)).toBe('a');
    expect(prop(tag).set('b')(source)).toEqual({ [tag]: 'b', other: 1 });
  });

  it('writes to a frozen object without throwing', () => {
    const frozen = Object.freeze({ money: 1, cards: 2 } satisfies Pocket);

    expect(prop('money').set(9)(frozen)).toEqual({ money: 9, cards: 2 });
  });
});

describe('prop on arrays', () => {
  it('reads an index', () => {
    expect(prop(1).get([10, 20, 30])).toBe(20);
  });

  it('returns a real array when writing an index', () => {
    const result = prop(1).set(99)([10, 20, 30]);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([10, 99, 30]);
    expect(result.length).toBe(3);
  });

  it('does not mutate the source array', () => {
    const source = [10, 20, 30];
    prop(1).set(99)(source);

    expect(source).toEqual([10, 20, 30]);
  });

  it('grows the array when writing past its end', () => {
    const result = prop(4).set(9)([1, 2]);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
    expect(result[4]).toBe(9);
  });
});

describe('prop on class instances', () => {
  class Person {
    constructor(public name: string) {}
    greet(): string {
      return `hi ${this.name}`;
    }
  }

  it('preserves the prototype so instanceof still holds', () => {
    const result = prop('name').set('Leon')(new Person('Iago'));

    expect(result).toBeInstanceOf(Person);
  });

  it('preserves prototype methods', () => {
    const result = prop('name').set('Leon')(new Person('Iago'));

    expect(result.greet()).toBe('hi Leon');
  });
});

describe('prop on nullish input', () => {
  const nullish = null as unknown as User;
  const undef = undefined as unknown as User;

  it('throws when reading from null', () => {
    expect(() => prop<User, 'name'>('name').get(nullish)).toThrow(TypeError);
  });

  it('throws when writing to null instead of fabricating an object', () => {
    expect(() => prop<User, 'name'>('name').set('Leon')(nullish)).toThrow(TypeError);
  });

  it('throws when writing to undefined instead of fabricating an object', () => {
    expect(() => prop<User, 'name'>('name').set('Leon')(undef)).toThrow(TypeError);
  });
});

describe('prop on the __proto__ key', () => {
  const protoLens = prop('__proto__' as never) as unknown as {
    get: (data: object) => unknown;
    set: (value: unknown) => (data: object) => Record<string, unknown>;
  };

  it('stores the write as an own property instead of dropping it', () => {
    const result = protoLens.set({ polluted: 1 })({ x: 1 });

    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true);
    expect(result['__proto__']).toEqual({ polluted: 1 });
  });

  it('leaves the prototype of the result untouched', () => {
    const result = protoLens.set({ polluted: 1 })({ x: 1 });

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it('never pollutes Object.prototype', () => {
    protoLens.set({ polluted: 1 })({ x: 1 });

    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('round-trips the written value', () => {
    const result = protoLens.set({ polluted: 1 })({ x: 1 });

    expect(protoLens.get(result)).toEqual({ polluted: 1 });
  });
});

describe('prop lens laws', () => {
  const pocket: Pocket = { money: 3213, cards: 2 };
  const moneyLens = prop<Pocket, 'money'>('money');

  it('get after set returns the written value (set-get)', () => {
    expect(moneyLens.get(moneyLens.set(1)(pocket))).toBe(1);
  });

  it('set of the current value is a no-op (get-set)', () => {
    expect(moneyLens.set(moneyLens.get(pocket))(pocket)).toEqual(pocket);
  });

  it('the last set wins (set-set)', () => {
    expect(moneyLens.set(2)(moneyLens.set(1)(pocket))).toEqual(moneyLens.set(2)(pocket));
  });
});
