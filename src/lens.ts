/**
 * Reads the focused value out of a data structure.
 */
export type Getter<A, B> = (data: A) => B;

/**
 * Writes the focused value, returning a new data structure.
 */
export type Setter<A, B> = (value: B) => (data: A) => A;

/**
 * A focus into a data structure: a getter paired with an immutable setter.
 */
export interface Lens<A, B> {
  get: Getter<A, B>;
  set: Setter<A, B>;
}

/**
 * Builds a {@link Lens} from a getter and a setter.
 */
export type LensBuilder = <A, B>(getter: Getter<A, B>, setter: Setter<A, B>) => Lens<A, B>;

/**
 * Creates a lens from `A` to `B` given a getter and a setter.
 *
 * @param getter - Reads the focused value.
 * @param setter - Returns a new structure with the focused value replaced.
 */
const lens: LensBuilder = (getter, setter) => ({
  get: getter,
  set: setter,
});

export default lens;
