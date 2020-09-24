import { Lens } from './lens';
declare type LensProp = <O, K extends keyof O = keyof O>(key: K) => Lens<O, O[K]>;
/**
 * Creates a lens focused on given property.
 * @param key - Property to focus.
 */
declare const prop: LensProp;
export default prop;
