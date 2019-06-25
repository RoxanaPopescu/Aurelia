/**
 * Represents any class, optionally constrained to classes extending T.
 */
export type Type<T = any> = new (...args: any[]) => T;
