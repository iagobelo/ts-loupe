import { Lens } from './lens';
import prop from './prop';

// prettier-ignore
interface LensPath {
  <
    A,
    K1 extends keyof A
  >(path: [K1]): Lens<A, A[K1]>;

  <
    A,
    K1 extends keyof A,
    K2 extends keyof A[K1]
  >(path: [K1, K2]): Lens<A, A[K1][K2]>;

  <
    A,
    K1 extends keyof A,
    K2 extends keyof A[K1],
    K3 extends keyof A[K1][K2]
  >(path: [K1, K2, K3]): Lens<A, A[K1][K2][K3]>;

  <
    A,
    K1 extends keyof A,
    K2 extends keyof A[K1],
    K3 extends keyof A[K1][K2],
    K4 extends keyof A[K1][K2][K3]
  >(path: [K1, K2, K3, K4]): Lens<A, A[K1][K2][K3][K4]>;

  <
    A,
    K1 extends keyof A,
    K2 extends keyof A[K1],
    K3 extends keyof A[K1][K2],
    K4 extends keyof A[K1][K2][K3],
    K5 extends keyof A[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5]): Lens<A, A[K1][K2][K3][K4][K5]>;
}

/**
 *
 * @param path
 */
const path: LensPath = (path: any[]) => ({
  get: (data: any) => {
    const lens = prop<any>(path[0]);
    return path
      .slice(1)
      .reduce((obj, p) => prop<any>(p).get(obj), lens.get(data));
  },
  set: (value: any) => (data: any) => {
    return path
      .reduce(
        (a, p, index) =>
          index === 0
            ? [prop<any>(p).get(data)]
            : [...a, prop<any>(p).get(a[index - 1])],
        []
      )
      .reverse()
      .reduce();
  }
});

const t = <A, B, C, D, E>(
  ab: Lens<A, B>,
  bc: Lens<B, C>,
  cd: Lens<C, D>,
  de: Lens<D, E>
): Lens<A, E> => ({
  set: e => a => {
    const b1 = ab.get(a);
    const c1 = bc.get(b1);
    const d1 = cd.get(c1);
    const d2 = de.set(e)(d1);
    const c2 = cd.set(d2)(c1);
    const b2 = bc.set(c2)(b1);
    return ab.set(b2)(a);
  },

  get: a => bc.get(ab.get(a))
});

// set = value => data => data

export default path;
