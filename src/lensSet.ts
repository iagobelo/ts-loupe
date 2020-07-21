import { Lens } from './lens';

export type LensSet = <O, V>(
  lens: Pick<Lens<O, V>, 'set'>
) => (value: V) => (data: O) => O;

/**
 *
 * @param lens
 */
const set: LensSet = lens => value => lens.set(value);

export default set;
