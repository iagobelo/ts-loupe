import { Lens } from './lens';

type LensProp = <O, K extends keyof O = keyof O>(key: K) => Lens<O, O[K]>;

/**
 *
 * @param key
 */
const prop: LensProp = key => ({
  get: data => data[key],
  set: value => data => ({ ...data, [key]: value })
});

export default prop;
