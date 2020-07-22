export type Getter<A, B> = (data: A) => B;

export type Setter<A, B> = (value: B) => (data: A) => A;

export interface Lens<A, B> {
  get: Getter<A, B>;
  set: Setter<A, B>;
  ap: <C>(fn: (b: B) => C) => Lens<A, C>;
}

export type LensBuilder = <A, B>(
  getter: Getter<A, B>,
  setter: Setter<A, B>
) => Lens<A, B>;

/**
 *
 * @param getter
 * @param setter
 */
const lens: LensBuilder = (getter, setter) => ({
  get(a) {
    return getter(a);
  },
  set: setter
});

export default lens;
