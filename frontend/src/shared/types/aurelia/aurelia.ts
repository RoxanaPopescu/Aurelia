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

/**
 * Represents a function in a component in Aurelia, called when a specific observed property changes.
 * @param newValue The new property value.
 * @param oldValue The old property value.
 */
export type PropertyChangedHandler = (newValue: any, oldValue: any) => void;

/**
 * Represents a function in a component in Aurelia, called when any observed property changes.
 * @param newValue The new property value.
 * @param oldValue The old property value.
 * @param propertyName The name of the property that changed.
 */
export type AnyPropertyChangedHandler = (newValue: any, oldValue: any, propertyName: string) => void;
