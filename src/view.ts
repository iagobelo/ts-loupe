import type { Lens } from './lens.js';

type LensView = <O, V>(lens: Pick<Lens<O, V>, 'get'>) => (data: O) => V;

/**
 * Returns the property using the given lens.
 * @param lens - Lens to get (view) the property.
 */
const view: LensView = (lens) => lens.get;

export default view;
