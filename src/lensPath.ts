import { Lens } from './lens';
import prop from './lensProp';

// prettier-ignore
type LensPath = {
  <
    O,
    K1 extends keyof O,
    PATH1 extends [K1],

    K2 extends keyof O[K1],
    PATH2 extends [K1, K2],

    K3 extends keyof O[K1][K2],
    PATH3 extends [K1, K2, K3],

    K4 extends keyof O[K1][K2][K3],
    PATH4 extends [K1, K2, K3, K4],

    PATH extends PATH1 | PATH2 | PATH3 | PATH4,

    VALUE = PATH extends PATH1
    ? O[K1]
    : PATH extends PATH2
    ? O[K1][K2]
    : PATH extends PATH3
    ? O[K1][K2][K3]
    : PATH extends PATH4
    ? O[K1][K2][K3][K4]
    : O,
  >(path: PATH): Lens<O, VALUE>;
}

/**
 *
 * @param path
 */
const path: LensPath = (path: any[]) => ({
  get: data => {
    const lens = prop<any>(path[0]);
    return path
      .slice(1)
      .reduce((obj, p) => prop<any>(p).get(obj), lens.get(data));
  },
  set: value => data => {
    const lens = prop<any>(path[0]);
    return path
      .slice(1)
      .reduce((obj, p) => prop<any>(p).set(obj), lens.set(data));
  }
});

export default path;
