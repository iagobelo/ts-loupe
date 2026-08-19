import { describe, expect, it } from 'vitest';
import { lens, prop, view } from '../src/index.js';

type User = { name: string };

describe('view', () => {
  it('reads the focused value from a full lens', () => {
    const nameLens = lens<User, string>(
      (user) => user.name,
      (name) => (user) => ({ ...user, name }),
    );

    expect(view(nameLens)({ name: 'Len' })).toBe('Len');
  });

  it('accepts a getter-only lens', () => {
    expect(view({ get: (user: User) => user.name })({ name: 'Len' })).toBe('Len');
  });

  it('reads through a prop lens', () => {
    expect(view(prop<User, 'name'>('name'))({ name: 'Len' })).toBe('Len');
  });
});
