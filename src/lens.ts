export type Getter<O, V> = (data: O) => V;

export type Setter<O, V> = (value: V) => (data: O) => O;

export type Lens<O, V> = {
  get: Getter<O, V>;
  set: Setter<O, V>;
};

export type LensBuilder = <O, V>(
  getter: Getter<O, V>,
  setter: Setter<O, V>
) => Lens<O, V>;

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
