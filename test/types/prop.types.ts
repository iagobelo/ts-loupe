import { prop, type Lens } from '../../src/index.js';
import { assertType, type Equals } from './helpers.js';

type User = { name: string; age: number; pocket: { money: number } };
const user: User = { name: 'a', age: 1, pocket: { money: 2 } };

// --- Inferred form: no type arguments at all (the headline 2.0 requirement) ---
assertType<Equals<ReturnType<typeof readAge>, number>>();
function readAge() {
  return prop('age').get(user);
}

assertType<Equals<ReturnType<typeof writeAge>, User>>();
function writeAge() {
  return prop('age').set(42)(user);
}

// A value of the wrong type must not be accepted.
// @ts-expect-error 'age' is a number, not a string
prop('age').set('str')(user);

// A key the object does not have must not be accepted.
// @ts-expect-error 'nope' is not a key of User
prop('nope').get(user);

// --- The v0.x documented form must now fail loudly instead of silently widening ---
// In v0.x this compiled and produced Lens<User, string | number | { money: number }>.
// @ts-expect-error supplying only the object type is no longer allowed
prop<User>('age');

// --- Explicit form: both type arguments, produces a concrete composable Lens ---
assertType<Equals<typeof explicitAge, Lens<User, number>>>();
const explicitAge = prop<User, 'age'>('age');

// @ts-expect-error the explicit form is type-safe too
explicitAge.set('str');

// @ts-expect-error a key outside User is rejected
prop<User, 'nope'>('nope');

// --- Arrays keep their array type ---
const nums = [1, 2, 3];

assertType<Equals<ReturnType<typeof readIndex>, number>>();
function readIndex() {
  return prop(1).get(nums);
}

assertType<Equals<ReturnType<typeof writeIndex>, number[]>>();
function writeIndex() {
  return prop(1).set(9)(nums);
}

// @ts-expect-error the element type is number, not string
prop(1).set('str')(nums);
