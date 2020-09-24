import { Lens } from './lens';
declare type LensView = <O, V>(lens: Pick<Lens<O, V>, 'get'>) => (data: O) => V;
/**
 * Returns the property using the given lens.
 * @param lens - Lens to get (view) the property.
 */
declare const view: LensView;
export default view;
