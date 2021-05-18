import { Lens } from './lens';
export interface LensCompose {
    <A, B, C>(...lenses: [Lens<A, B>, Lens<B, C>]): Lens<A, C>;
}
/**
 * Compose two lenses (`Lens<A, B>, Lens<B, C>`) to produce a new lens `Lens<A, C>`.
 * @param lenses
 */
declare const compose: LensCompose;
export default compose;
