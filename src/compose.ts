import { Lens } from './lens';

// prettier-ignore
export interface LensCompose {
  <A, B, C>(...lenses: [Lens<A, B>, Lens<B, C>]): Lens<A, C>;
  <A, B, C, D>(...lenses: [Lens<A, B>, Lens<B, C>, Lens<C, D>]): Lens<A, D>;
  <A, B, C, D, E>(...lenses: [Lens<A, B>, Lens<B, C>, Lens<C, D>, Lens<D, E>]): Lens<A, E>;
  <A, B, C, D, E, F>(...lenses: [Lens<A, B>, Lens<B, C>, Lens<C, D>, Lens<D, E>, Lens<D, F>]): Lens<A, F>;
  <A, B, C, D, E, F, G>(...lenses: [Lens<A, B>, Lens<B, C>, Lens<C, D>, Lens<D, E>, Lens<E, F>, Lens<F, G>]): Lens<A, G>;
  <A, B, C, D, E, F, G, H>(...lenses: [Lens<A, B>, Lens<B, C>, Lens<C, D>, Lens<D, E>, Lens<E, F>, Lens<F, G>, Lens<G, H>]): Lens<A, H>;
}

const compose: LensCompose = (...lenses: Lens<any, any>[]) => {
  return {
    get: (o: any) =>
      lenses.slice(1).reduce((a, c) => c.get(a), lenses[0].get(o)),
    set: (value: any) => (o: any) =>
      lenses
        .reverse()
        .slice(1)
        .reduce(() => lenses[0].set(value), lenses[0].get(o))
  };
};

export default compose;
