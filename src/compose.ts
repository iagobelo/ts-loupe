import type { Lens } from './lens.js';

/**
 * Composes lenses left to right, threading the focus of each one into the next,
 * to produce a single lens from the outermost structure to the innermost value.
 */
export interface LensCompose {
  <A, B>(lens1: Lens<A, B>): Lens<A, B>;
  <A, B, C>(lens1: Lens<A, B>, lens2: Lens<B, C>): Lens<A, C>;
  <A, B, C, D>(lens1: Lens<A, B>, lens2: Lens<B, C>, lens3: Lens<C, D>): Lens<A, D>;
  <A, B, C, D, E>(
    lens1: Lens<A, B>,
    lens2: Lens<B, C>,
    lens3: Lens<C, D>,
    lens4: Lens<D, E>,
  ): Lens<A, E>;
  <A, B, C, D, E, F>(
    lens1: Lens<A, B>,
    lens2: Lens<B, C>,
    lens3: Lens<C, D>,
    lens4: Lens<D, E>,
    lens5: Lens<E, F>,
  ): Lens<A, F>;
  <A, B, C, D, E, F, G>(
    lens1: Lens<A, B>,
    lens2: Lens<B, C>,
    lens3: Lens<C, D>,
    lens4: Lens<D, E>,
    lens5: Lens<E, F>,
    lens6: Lens<F, G>,
  ): Lens<A, G>;
  <A, B, C, D, E, F, G, H>(
    lens1: Lens<A, B>,
    lens2: Lens<B, C>,
    lens3: Lens<C, D>,
    lens4: Lens<D, E>,
    lens5: Lens<E, F>,
    lens6: Lens<F, G>,
    lens7: Lens<G, H>,
  ): Lens<A, H>;
}

type AnyLens = Lens<unknown, unknown>;

const composePair = (outer: AnyLens, inner: AnyLens): AnyLens => ({
  get: (data) => inner.get(outer.get(data)),
  set: (value) => (data) => outer.set(inner.set(value)(outer.get(data)))(data),
});

const compose = ((...lenses: AnyLens[]) => {
  if (lenses.length === 0) {
    throw new TypeError('compose() requires at least one lens.');
  }

  return lenses.reduce(composePair);
}) as LensCompose;

export default compose;
