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
    const lens = prop<any>(path[0]);
    return path
      .slice(1)
      .reduce((obj, p) => prop<any>(p).set(obj), lens.set(data));
  }
});

export default path;
