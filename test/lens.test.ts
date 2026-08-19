import { describe, expect, it } from 'vitest';
import { lens } from '../src/index.js';

type User = { name: string; age: number };

const nameLens = lens<User, string>(
  (user) => user.name,
  (name) => (user) => ({ ...user, name }),
);

describe('lens', () => {
  it('builds a lens exposing get and set', () => {
    expect(typeof nameLens.get).toBe('function');
    expect(typeof nameLens.set).toBe('function');
  });

  it('reads through the provided getter', () => {
    expect(nameLens.get({ name: 'Lenon', age: 20 })).toBe('Lenon');
  });

  it('writes through the provided setter without mutating the input', () => {
    const user: User = { name: 'Lenon', age: 20 };
    const next = nameLens.set('Leon')(user);

    expect(next).toEqual({ name: 'Leon', age: 20 });
    expect(user).toEqual({ name: 'Lenon', age: 20 });
    expect(next).not.toBe(user);
  });
});

describe('lens laws', () => {
  const user: User = { name: 'Lenon', age: 20 };

  it('get after set returns the written value (set-get)', () => {
    expect(nameLens.get(nameLens.set('Leon')(user))).toBe('Leon');
  });

  it('set of the current value is a no-op (get-set)', () => {
    expect(nameLens.set(nameLens.get(user))(user)).toEqual(user);
  });

  it('the last set wins (set-set)', () => {
    expect(nameLens.set('B')(nameLens.set('A')(user))).toEqual(nameLens.set('B')(user));
  });
});
