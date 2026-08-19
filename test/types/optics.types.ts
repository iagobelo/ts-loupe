import { over, set, view, type Lens } from '../../src/index.js';
import { assertType, type Equals } from './helpers.js';

type User = { name: string };

declare const full: Lens<User, string>;

// --- view accepts a getter-only lens ---
assertType<Equals<ReturnType<typeof readName>, string>>();
function readName() {
  return view({ get: (user: User) => user.name })({ name: 'a' } as User);
}

// --- set accepts a setter-only lens ---
assertType<Equals<ReturnType<typeof writeName>, User>>();
function writeName() {
  return set({ set: (name: string) => (user: User) => ({ ...user, name }) })('b')({ name: 'a' });
}

// --- over requires a full lens, because it both reads and writes ---
// @ts-expect-error a getter-only lens cannot be used with over
over({ get: (user: User) => user.name });

assertType<Equals<ReturnType<typeof mapName>, User>>();
function mapName() {
  return over(full)((name) => name.toUpperCase())({ name: 'a' });
}
