import { describe, expect, it } from 'vitest';
import { lens, set } from '../src/index.js';

type User = { name: string; age: number };

const nameLens = lens<User, string>(
  (user) => user.name,
  (name) => (user) => ({ ...user, name }),
);

describe('set', () => {
  it('writes the value through the lens setter', () => {
    expect(set(nameLens)('John Wick')({ name: 'Len', age: 1 })).toEqual({
      name: 'John Wick',
      age: 1,
    });
  });

  it('accepts a setter-only lens', () => {
    const setterOnly = { set: (name: string) => (user: User) => ({ ...user, name }) };

    expect(set(setterOnly)('Leon')({ name: 'Len', age: 1 })).toEqual({ name: 'Leon', age: 1 });
  });

  it('does not mutate the input', () => {
    const user: User = { name: 'Len', age: 1 };
    set(nameLens)('Leon')(user);

    expect(user).toEqual({ name: 'Len', age: 1 });
  });
});
