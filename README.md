# TS Loupe

[![CI](https://github.com/iagobelo/ts-loupe/actions/workflows/ci.yml/badge.svg)](https://github.com/iagobelo/ts-loupe/actions/workflows/ci.yml)
[![npm](https://badgen.net/npm/v/ts-loupe)](https://www.npmjs.com/package/ts-loupe)
[![License](https://badgen.net/github/license/iagobelo/ts-loupe)](./LICENSE)
[![Library minified size](https://badgen.net/bundlephobia/min/ts-loupe)](https://bundlephobia.com/result?p=ts-loupe)
[![Library minified + gzipped size](https://badgen.net/bundlephobia/minzip/ts-loupe)](https://bundlephobia.com/result?p=ts-loupe)

Strongly typed, dependency-free lenses for TypeScript.

A lens is a first-class focus into a data structure: it reads a value out and writes a new
structure back, without mutating the original.

## Installation

```sh
npm install ts-loupe
```

Ships ESM and CommonJS builds with type declarations for both, plus a UMD bundle for the browser.
Requires Node.js 18 or newer.

### From a CDN

```html
<script src="https://unpkg.com/ts-loupe"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/ts-loupe"></script>

<script>
  // The global is named `ts-loupe`, so it is read with bracket access.
  const { prop, compose } = window['ts-loupe'];

  compose(prop('pocket'), prop('money')).get({ pocket: { money: 10 } }); // 10
</script>
```

## Quick start

```typescript
import { compose, over, prop } from 'ts-loupe';

type User = { name: string; pocket: { money: number } };

const user: User = { name: 'Jerry Lee', pocket: { money: 3213 } };

// No type arguments needed: the object type is inferred where the lens is used.
prop('name').get(user); // 'Jerry Lee'
prop('name').set('Leon Lan')(user); // a new user, `user` untouched

// Reach into nested structures.
const money = compose(prop<User, 'pocket'>('pocket'), prop<User['pocket'], 'money'>('money'));

money.get(user); // 3213
over(money)((amount) => amount * 2)(user); // { name: 'Jerry Lee', pocket: { money: 6426 } }
```

## API

- [`lens`](#lens) · [`prop`](#prop) · [`view`](#view) · [`set`](#set) · [`over`](#over) · [`compose`](#compose)

Every function is curried and never mutates its input.

### `lens`

Builds a lens from a getter and a setter.

```typescript
type Getter<A, B> = (data: A) => B;
type Setter<A, B> = (value: B) => (data: A) => A;

interface Lens<A, B> {
  get: Getter<A, B>;
  set: Setter<A, B>;
}

declare const lens: <A, B>(getter: Getter<A, B>, setter: Setter<A, B>) => Lens<A, B>;
```

```typescript
type User = { name: string; age: number };

const nameLens = lens<User, string>(
  (user) => user.name,
  (name) => (user) => ({ ...user, name }),
);

nameLens.get({ name: 'Jerry Lee', age: 18 }); // 'Jerry Lee'
```

### `prop`

Creates a lens focused on a property. It has two forms.

```typescript
interface LensProp {
  // Explicit: yields a concrete Lens, which is what `compose` needs.
  <O, K extends keyof O>(key: K): Lens<O, O[K]>;
  // Inferred: the object type is resolved where the lens is applied.
  <K extends PropertyKey>(key: K): PropLens<K>;
}
```

The inferred form needs no annotation and is still fully type-safe:

```typescript
type User = { name: string; age: number };

const user: User = { name: 'Len', age: 20 };

prop('age').get(user); // number
prop('age').set(21)(user); // User
prop('age').set('21')(user); // ✗ compile error: 'age' is a number
prop('nope').get(user); // ✗ compile error: 'nope' is not a key of User
```

The explicit form pins both type arguments and produces a composable `Lens`:

```typescript
const ageLens = prop<User, 'age'>('age'); // Lens<User, number>
```

Numeric keys focus array elements and keep the array an array:

```typescript
prop(1).set(99)([10, 20, 30]); // [10, 99, 30] — a real Array
```

Writing preserves the prototype, so class instances survive an update:

```typescript
class Person {
  constructor(public name: string) {}
  greet() {
    return `hi ${this.name}`;
  }
}

const updated = prop('name').set('Leon')(new Person('Iago'));

updated instanceof Person; // true
updated.greet(); // 'hi Leon'
```

Writing to `null` or `undefined` throws a `TypeError` rather than inventing an object.

### `view`

Reads the focused value. Accepts a getter-only lens.

```typescript
declare const view: <O, V>(lens: Pick<Lens<O, V>, 'get'>) => (data: O) => V;

view(prop<User, 'name'>('name'))(user); // 'Len'
```

### `set`

Writes the focused value. Accepts a setter-only lens.

```typescript
declare const set: <O, V>(lens: Pick<Lens<O, V>, 'set'>) => (value: V) => (data: O) => O;

set(prop<User, 'name'>('name'))('Leon')(user); // a new user
```

### `over`

Applies a function to the focused value. Needs a full lens, since it both reads and writes.

```typescript
declare const over: <O, V>(lens: Lens<O, V>) => (fn: (value: V) => V) => (data: O) => O;

over(prop<User, 'name'>('name'))((name) => name.toUpperCase())(user);
```

### `compose`

Composes lenses left to right, from the outermost structure to the innermost value. Accepts one
to seven lenses.

```typescript
type Outer = { a: { b: { c: number } } };

const c = compose(
  prop<Outer, 'a'>('a'),
  prop<Outer['a'], 'b'>('b'),
  prop<Outer['a']['b'], 'c'>('c'),
);

c.get({ a: { b: { c: 1 } } }); // 1
c.set(9)({ a: { b: { c: 1 } } }); // { a: { b: { c: 9 } } }
```

Every sibling at every level is preserved. A broken chain, or calling `compose()` with no
arguments, is a compile error.

## Migrating from 0.x

`2.0.0` is a breaking release. The changes below are the ones that need action.

### Type declarations are published again

`0.1.2` declared `"types": "types/index.d.ts"` but shipped no such file, so every TypeScript
consumer silently got `any`:

```
error TS7016: Could not find a declaration file for module 'ts-loupe'.
```

Nothing to do beyond upgrading — the package now validates clean under `publint` and
`@arethetypeswrong/cli` in all four resolution modes, and CI fails if that ever regresses.

### `prop<User>('age')` no longer compiles

This was the form the old README documented, and it was not type-safe. Because TypeScript has no
partial type-argument inference, supplying only `O` made `K` fall back to its default `keyof O`,
so the lens focused the **union of every property type**:

```typescript
// 0.x — compiled, but this is Lens<User, string | number | { money: number }>
const ageLens = prop<User>('age');

ageLens.set('not a number')(user); // 0.x: compiled ✗   2.0: compile error ✓
```

Replace it with either form:

```typescript
prop('age'); // inferred — preferred
prop<User, 'age'>('age'); // explicit — use when you need a concrete Lens to compose
```

### `compose` no longer corrupts deep structures

In `0.x`, `compose` only ever read `lenses[0]` and `lenses[1]`. A third lens was accepted at
runtime and silently destroyed the level it should have descended into:

```typescript
const c = compose(prop('a'), prop('b'), prop('c'));

// 0.x
c.get({ a: { b: { c: 1 } } }); // { c: 1 }      ← the intermediate object
c.set(9)({ a: { b: { c: 1 } } }); // { a: { b: 9 } }  ← `{ c: 1 }` destroyed

// 2.0
c.get({ a: { b: { c: 1 } } }); // 1
c.set(9)({ a: { b: { c: 1 } } }); // { a: { b: { c: 9 } } }
```

`compose` with a single lens returned a lens that threw on use; it now returns that lens.
`compose()` with no arguments threw `Cannot read properties of undefined` on first use; it now
throws a descriptive `TypeError` immediately.

### Arrays stay arrays

```typescript
prop(1).set(99)([10, 20, 30]);

// 0.x: { '0': 10, '1': 99, '2': 30 }   — Array.isArray === false, length === undefined
// 2.0: [10, 99, 30]                    — a real Array
```

### Class instances keep their prototype

`0.x` used object spread, which dropped the prototype: the result failed `instanceof` and lost
every method. `2.0` preserves it.

### Writing to `null` or `undefined` throws

```typescript
prop<User, 'name'>('name').set('Leon')(null);

// 0.x: { name: 'Leon' }  — an object invented out of nothing
// 2.0: TypeError: Cannot set property name of null.
```

### Package entry points moved

The package is now ESM-first with `"exports"`, so deep imports into `dist/` are no longer
reachable. Import the package entry instead:

```typescript
import { prop } from 'ts-loupe'; // ESM
const { prop } = require('ts-loupe'); // CommonJS — still supported
```

The UMD bundle stays at `dist/index.umd.js` and still attaches to the `ts-loupe` global, so
existing `<script>` tags keep working. `unpkg.com/ts-loupe` and `cdn.jsdelivr.net/npm/ts-loupe`
now resolve to the minified bundle.

### Node.js 18 or newer

`engines.node` is declared for the first time, as `>=18`. CI runs the full suite on Node 20, 22,
24 and 26, and additionally installs the packed tarball on Node 18 and 20 and exercises it with
nothing but Node, so the floor is tested rather than assumed.

## License

Released under the [MIT License](./LICENSE).
