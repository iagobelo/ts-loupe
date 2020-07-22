import { Lens } from './lens';

type LensOver = <O, V>(
  lens: Lens<O, V>
) => (fn: (value: V) => V) => (data: O) => O;

/**
 *
 * @param lens
 */
const over: LensOver = lens => fn => data => lens.set(fn(lens.get(data)))(data);

export default over;
