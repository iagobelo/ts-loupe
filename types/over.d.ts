import { Lens } from './lens';
/**
 * Type definition of LensOver.
 */
declare type LensOver = <O, V>(lens: Lens<O, V>) => (fn: (value: V) => V) => (data: O) => O;
/**
 * Applies the function to the given lens property and returns the result.
 * @param lens - Lens that will be used to get and set the resulting value.
 */
declare const over: LensOver;
export default over;
