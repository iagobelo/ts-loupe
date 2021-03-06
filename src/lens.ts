/**
 * Type definition of a Lens Getter.
 */
export type Getter<A, B> = (data: A) => B;

/**
 * Type definition of a Lens Setter.
 */
export type Setter<A, B> = (value: B) => (data: A) => A;

/**
 * Type definition of a Lens.
 */
export interface Lens<A, B> {
  get: Getter<A, B>;
  set: Setter<A, B>;
}

/**
 * Type definition of a lens builder.
 */
export type LensBuilder = <A, B>(
  getter: Getter<A, B>,
  setter: Setter<A, B>
) => Lens<A, B>;

/**
 * Creates a lens from A to B given the getter and setter.
 * @param {Getter} getter - Implementation of a lens getter.
 * @param {Setter} setter - Implementation of a lens setter.
 */
const lens: LensBuilder = (getter, setter) => ({
  get: getter,
  set: setter
});

export default lens;
