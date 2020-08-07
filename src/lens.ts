export type Getter<A, B> = (data: A) => B;

export type Setter<A, B> = (value: B) => (data: A) => A;

export interface Lens<A, B> {
  get: Getter<A, B>;
  set: Setter<A, B>;
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
  get: getter,
  set: setter
});

export default lens;
