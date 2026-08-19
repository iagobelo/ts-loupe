import type { Lens } from './lens.js';

export type LensSet = <O, V>(lens: Pick<Lens<O, V>, 'set'>) => (value: V) => (data: O) => O;

/**
 * Sets the value using the given lens and returns the resulting structure.
 * @param lens - Lens that will be used to set the value.
 */
const set: LensSet = (lens) => (value) => lens.set(value);

export default set;
