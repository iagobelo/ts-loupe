import type { Lens } from './lens.js';

/**
 * Type definition of LensOver.
 */
type LensOver = <O, V>(lens: Lens<O, V>) => (fn: (value: V) => V) => (data: O) => O;

/**
 * Applies the function to the given lens property and returns the result.
 * @param lens - Lens that will be used to get and set the resulting value.
 */
const over: LensOver = (lens) => (fn) => (data) => lens.set(fn(lens.get(data)))(data);

export default over;
