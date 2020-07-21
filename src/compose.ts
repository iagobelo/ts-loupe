import { Getter, Lens } from './lens';

type Param = {};

// prettier-ignore
type LensCompose = 
  <
    O,
    A, B, C, D, E,
    X1 extends [Lens<O, A>],
    X2 extends [Lens<O, A>, Lens<A, B>],
    X3 extends [Lens<O, A>, Lens<A, B>, Lens<B, C>],
    X4 extends [Lens<O, A>, Lens<A, B>, Lens<B, C>, Lens<C, D>],
    X5 extends [Lens<O, A>, Lens<A, B>, Lens<B, C>, Lens<C, D>, Lens<D, E>],
    
    Lenses extends  X1 | X2 | X3 | X4 | X5,
    Result = Lenses extends X1
      ? Lens<O, A>
      : Lenses extends X2
      ? Lens<O, B>
      : Lenses extends X3
      ? Lens<O, C>
      : Lenses extends X4
      ? Lens<O, D>
      : Lenses extends X5
      ? Lens<O, E>
      : Lens<O, any>
  >(...lenses: Lenses) => Result;

const compose: LensCompose = lenses => ({
  get: (data: any) =>
    lenses.slice(1).reduce((a, c) => c.get(a), (lenses[0] as X1[0]).get(data)),
  set: (value: any) => (data: any) => lenses[0].set(value)(data)
});

/*({
    get: (o: O) => lenses.slice(1).reduce((a, c) => c.get(a), lenses[0].get(o)),
    set: value => o =>
      lenses.slice(1).reduce((a, c) => c.get(a), lenses[0].get(o))
  });*/

export default compose;
