import { Lens } from './lens';

type LensView = <O, V>(lens: Pick<Lens<O, V>, 'get'>) => (data: O) => V;

/**
 *
 * @param lens
 */
const view: LensView = lens => lens.get;

export default view;
