/**
 * Represents a callback from a component in Aurelia.
 * @returns A value of type `TResult`.
 */
export type Callback<TResult = void> = () => TResult;

/**
 * Represents a callback from a component in Aurelia.
 * @param context The binding context, of type `TContext`.
 * @returns A value of type `TResult`.
 */
export type CallbackWithContext<TContext = {}, TResult = void> = (context: TContext) => TResult;

/**
 * Represents an asynchronous callback from a component in Aurelia.
 * @returns A value, or a promise for a value, of type `TResult`.
 */
export type AsyncCallback<TResult = void> = () => TResult | Promise<TResult>;

/**
 * Represents an asynchronous callback from a component in Aurelia.
 * @param context The binding context, of type `TContext`.
 * @returns A value, or a promise for a value, of type `TResult`.
 */
export type AsyncCallbackWithContext<TContext = {}, TResult = void> = (context: TContext) => TResult | Promise<TResult>;
