import { compose, prop, type Lens } from '../../src/index.js';
import { assertType, type Equals } from './helpers.js';

type Inner = { c: number };
type Middle = { b: Inner };
type Outer = { a: Middle };

const a = prop<Outer, 'a'>('a');
const b = prop<Middle, 'b'>('b');
const c = prop<Inner, 'c'>('c');

// --- Two lenses ---
assertType<Equals<typeof two, Lens<Outer, Inner>>>();
const two = compose(a, b);

// --- Three lenses in a single call (a TypeError-producing arity in v0.x) ---
assertType<Equals<typeof three, Lens<Outer, number>>>();
const three = compose(a, b, c);

// --- One lens ---
assertType<Equals<typeof one, Lens<Outer, Middle>>>();
const one = compose(a);

// --- Zero lenses is rejected at compile time ---
// @ts-expect-error compose requires at least one lens
compose();

// --- A broken chain is rejected: `a` focuses Middle, so `c` cannot follow it ---
// @ts-expect-error Lens<Inner, number> does not compose after Lens<Outer, Middle>
compose(a, c);
