import { Lens } from './lens';

type LensMap = <A, B, C>(
  lens: Lens<A, B>
) => (fn: (value: B) => C) => (data: A) => A;

/**
 *
 * @param lens
 */
const over = lens => fn => data => lens.set(fn(lens.get(data)))(data);

export default over;
