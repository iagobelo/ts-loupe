# TS Loupe

[![Build Status](https://travis-ci.org/iagobelo/ts-loupe.svg?branch=master)](https://travis-ci.org/iagobelo/ts-loupe)
[![License](https://badgen.net/github/license/iagobelo/ts-loupe)](./LICENSE)
[![Library minified size](https://badgen.net/bundlephobia/min/ts-loupe)](https://bundlephobia.com/result?p=ts-loupe)
[![Library minified + gzipped size](https://badgen.net/bundlephobia/minzip/ts-loupe)](https://bundlephobia.com/result?p=ts-loupe)

## About

Lenses is a pattern used to read and update properties within an object.

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install ts-loupe --save

# For Yarn, use the command below.
yarn add ts-loupe
```

### Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/ts-loupe"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/ts-loupe"></script>
```

## API

- [Lens](#lens)
- [View](#view)
- [Set](#set)
- [Over](#over)
- [Prop](#prop)
- [Compose](#compose)

### Lens

Is a pair of two functions that abstracts the way of we access the requested field. In other words is a focus into some data structure.

Signature:

```typescript
type Getter<A, B> = (data: A) => B;

type Setter<A, B> = (value: B) => (data: A) => A;

interface Lens<A, B> {
  get: Getter<A, B>;
  set: Setter<A, B>;
}
```

Example:

```typescript
type User = { name: string; age: number };

const user: User = { name: 'Jerry Lee', age: 18 };

const getName = (user: User) => user.name;
const setName = (name: User['name']) => (data: User) => ({ ...data, name });

const nameLens = lens(getName, setName);

nameLens.get(user); // returns: "Jerry Lee".
nameLens.set('Leon Lan')(user); // returns: A new user with Leon Lan as the name.
```

### View

Returns the data structure pointed to by the lens getter function.

Signature:

```typescript
type LensView = <O, V>(lens: Pick<Lens<O, V>, 'get'>) => (data: O) => V;
```

Example:

```typescript
type User = { name: string };

const user: User = { name: 'Len Lon' };

const getName = (user: User) => user.name;
const setName = (name: User['name']) => (data: User) => ({ ...data, name });

const nameLens = lens(getName, setName);

view(nameLens)(user); //returns: "Len Lon".
```

### Set

Set is used to 'set' a value into the data structure pointed to by the lens setter function.

Signature:

```typescript
type LensSet = <O, V>(
  lens: Pick<Lens<O, V>, 'set'>
) => (value: V) => (data: O) => O;
```

Example:

```typescript
type User = { name: string };

const user: User = { name: 'Jackie Chan' };

const getName = (user: User) => user.name;
const setName = (name: User['name']) => (data: User) => ({ ...data, name });
const nameLens = lens(getName, setName);

lensSet(nameLens)('John Wick')(user); // returns: A new user with "John Wick" as the name.
```

### Over

Applies the function to the given lens property and returns the result.

Signature:

```typescript
type LensOver = <O, V>(
  lens: Lens<O, V>
) => (fn: (value: V) => V) => (data: O) => O;
```

Example:

```typescript
type User = { name: string };

const user: User = { name: 'Santino' };
const nameLens = prop<User>('name');

over(nameLens)(name => `${name} D'Antonio`)(user); // returns: A new user with "Santino D'Antonio" as the name.
```

### Prop

Creates a lens focused on a given property.

Signature:

```typescript
type LensProp = <O, K extends keyof O = keyof O>(key: K) => Lens<O, O[K]>;
```

Example:

```typescript
type User = { age: string; name: string };
lensProp<User>('age'); // returns: A lens instance focused on the age propertie.
```

### Compose

Compose two lenses `Lens<A, B>` and `Lens<B, C>`, to produce a new lens `Lens<A, C>`.

Signature:

```typescript
interface LensCompose {
  <A, B, C>(...lenses: [Lens<A, B>, Lens<B, C>]): Lens<A, C>;
}
```

Example:

```typescript
type User = {
  pocket: {
    money: number;
  };
};

const user: User = {
  pocket: {
    money: 3213
  }
};

const pocketLens = lensProp<User>('pocket');
const moneyLens = lensProp<User['pocket']>('money');

compose(
  pocketLens,
  moneyLens
); // returns: A new lens focused on money propertie.
```

## License

Released under [MIT License](./LICENSE).
