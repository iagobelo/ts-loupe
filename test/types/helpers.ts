/**
 * Exact type equality. Unlike `extends`, this rejects `any` and does not accept
 * a wider or narrower type, so the assertions below pin the type precisely.
 */
export type Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

export declare function assertType<_T extends true>(): void;
