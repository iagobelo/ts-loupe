import { describe, expect, it } from 'vitest';
import { over, prop, type Lens } from '../src/index.js';

type User = { name: string; age: number };

describe('over', () => {
  it('applies the function to the focused value', () => {
    const user: User = { name: 'Santino', age: 1 };
    const nameLens = prop<User, 'name'>('name');

    expect(over(nameLens)((name) => `${name} D'Antonio`)(user)).toEqual({
      name: "Santino D'Antonio",
      age: 1,
    });
  });

  it('does not mutate the input', () => {
    const user: User = { name: 'Santino', age: 1 };
    over(prop<User, 'name'>('name'))((name) => name.toUpperCase())(user);

    expect(user).toEqual({ name: 'Santino', age: 1 });
  });

  it('throws when the lens has no setter', () => {
    const getterOnly = { get: (user: User) => user.name } as unknown as Lens<User, string>;

    expect(() => over(getterOnly)((name) => name)({ name: 'a', age: 1 })).toThrow(TypeError);
  });
});
