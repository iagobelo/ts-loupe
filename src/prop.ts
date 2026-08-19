import type { Lens } from './lens.js';

/**
 * Structures that can be focused by the key `K`, optionally constraining the
 * focused value to `V`.
 *
 * A numeric key also accepts arrays, so `prop(1)` works on `number[]` without
 * collapsing it into a plain object.
 */
export type HasKey<K extends PropertyKey, V = unknown> = K extends number
  ? readonly V[] | { readonly [P in K]: V }
  : { readonly [P in K]: V };

/**
 * The type that the key `K` focuses inside `O`.
 */
export type Focus<O, K extends PropertyKey> = K extends keyof O ? O[K] : never;

/**
 * A lens focused on the key `K` whose object type is inferred where it is
 * applied, so `prop('age')` needs no type arguments at all.
 */
export interface PropLens<K extends PropertyKey> {
  get<O extends HasKey<K>>(data: O): Focus<O, K>;
  set<V>(value: V): <O extends HasKey<K, V>>(data: O) => O;
}

/**
 * Creates a lens focused on a property.
 *
 * Two forms are available. Passing no type arguments infers the object type at
 * the point of use. Passing both the object type and the key produces a
 * concrete {@link Lens}, which is the form {@link compose} needs.
 */
export interface LensProp {
  <O, K extends keyof O>(key: K): Lens<O, O[K]>;
  <K extends PropertyKey>(key: K): PropLens<K>;
}

/**
 * Copies `data` so that the original is never mutated, keeping its prototype so
 * class instances survive an update, and normalising descriptors so that frozen
 * inputs stay writable in the copy.
 */
const shallowCopy = (data: object): Record<PropertyKey, unknown> => {
  if (Array.isArray(data)) {
    return data.slice() as unknown as Record<PropertyKey, unknown>;
  }

  const descriptors = Object.getOwnPropertyDescriptors(data);

  for (const key of Reflect.ownKeys(descriptors)) {
    const descriptor = descriptors[key as string];

    if (descriptor === undefined) continue;

    descriptor.configurable = true;

    if ('value' in descriptor) {
      descriptor.writable = true;
    }
  }

  return Object.create(Object.getPrototypeOf(data), descriptors) as Record<PropertyKey, unknown>;
};

const prop = ((key: PropertyKey) => ({
  get: (data: Record<PropertyKey, unknown>) => data[key],

  set: (value: unknown) => (data: Record<PropertyKey, unknown>) => {
    if (data === null || data === undefined) {
      throw new TypeError(`Cannot set property ${String(key)} of ${String(data)}.`);
    }

    const next = shallowCopy(data);

    // `defineProperty` rather than assignment: it never invokes an inherited
    // setter, so a hostile key such as `__proto__` becomes a plain own property
    // instead of silently swapping the prototype and dropping the write.
    Object.defineProperty(next, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    return next;
  },
})) as LensProp;

export default prop;
