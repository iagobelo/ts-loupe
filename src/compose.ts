import { Lens } from './lens';

// prettier-ignore
export interface LensCompose {
  <A, B, C>(...lenses: [Lens<A, B>, Lens<B, C>]): Lens<A, C>;
}

/**
 *
 * @param lenses
 */
const compose: LensCompose = (...lenses) => ({
  get: a => lenses[1].get(lenses[0].get(a)),
  set: c => a => lenses[0].set(lenses[1].set(c)(lenses[0].get(a)))(a)
});

export default compose;
