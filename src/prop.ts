import { Lens } from './lens';

type LensProp = <O, K extends keyof O = keyof O>(key: K) => Lens<O, O[K]>;

/**
 * Creates a lens focused on given property.
 * @param key - Property to focus.
 */
const prop: LensProp = key => ({
  get: data => data[key],
  set: value => data => ({ ...data, [key]: value })
});

export default prop;
