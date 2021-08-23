// tslint:disable: no-parameter-reassignment no-invalid-this ban-types

import { debounce } from "./debounce";

/**
 * Represents the options to use when creating a throttled function.
 */
export interface IThrottleOptions
{
    /**
     * True to invoke the function on the leading edge, otherwise false.
     * Default is true.
     */
    leading?: boolean;

    /**
     * True to invoke the function on the trailing edge, otherwise false.
     * Default is true.
     */
    trailing?: boolean;
}

/**
 * Represents a debounced function.
 */
export interface IThrottledFunc extends Function
{
    /**
     * Cancels any delayed invocation.
     */
    cancel(): void;

    /**
     * Immediately executes any delayed invocation.
     * @returns The result of the delayed invocation or undefined.
     */
    flush(): any;
}

/**
 * Creates a throttled function, wrapping the specified function.
 * @param func The function to throttle.
 * @param wait The wait period, in milliseconds.
 * @param options The options to use.
 * @returns A throttled function, wrapping the specified function.
 */
export function createThrottledFunc<TFunc extends Function>(func: TFunc, wait = 0, options?: IThrottleOptions): TFunc & IThrottledFunc
{
    let leading = true;
    let trailing = true;

    if (typeof func !== "function")
    {
        throw new TypeError("Expected a function");
    }

    if (options != null)
    {
        leading = "leading" in options ? !!options.leading : leading;
        trailing = "trailing" in options ? !!options.trailing : trailing;
    }

    return debounce(func, wait,
    {
        leading: leading,
        maxWait: wait,
        trailing: trailing
    });
}

/**
 * Decorates a class method such that invocation happens at most once every wait period.
 *
 * The method is always called with the arguments provided in the most recent call.
 * Any throttled calls to the method return the result of the most recent invocation.
 *
 * Additional options may be provided to indicate whether the method should
 * be called on the leading and/or trailing edge of the wait periodt.
 *
 * Note that if `leading` and `trailing` options are true, the method is called on
 * the trailing edge of the wait period, only if the method is called more
 * than once during the wait period. If the wait period is 0 and `leading` is false,
 * method invocation is deferred until the next tick.
 *
 * Note that the throttled method is extended with a `cancel` method to cancel
 * any delayed invocations and a `flush` method to execute them immediately.
 *
 * For an explanation of the difference between debouncing and throttling,
 * see: https://css-tricks.com/debouncing-throttling-explained-examples
 *
 * @param wait The wait period, in milliseconds.
 * @param options The options to use.
 */
export function throttle<TFunc extends Function>(wait: number, options?: IThrottleOptions): any;

/**
 * Creates a throittled function that wraps the specified function, such that invocation
 * happens at most once every wait period.
 *
 * The function is always called with the arguments provided in the most recent call.
 * Any throttled calls to the function return the result of the most recent invocation.
 *
 * Additional options may be provided to indicate whether the function should
 * be called on the leading and/or trailing edge of the wait periodt.
 *
 * Note that if `leading` and `trailing` options are true, the function is called on
 * the trailing edge of the wait period, only if the function is called more
 * than once during the wait period. If the wait period is 0 and `leading` is false,
 * function invocation is deferred until the next tick.
 *
 * Note that the throttled function is extended with a `cancel` method to cancel
 * any delayed invocations and a `flush` method to execute them immediately.
 *
 * For an explanation of the difference between debouncing and throttling,
 * see: https://css-tricks.com/debouncing-throttling-explained-examples
 *
 * @param func The function to throttle.
 * @param wait The wait period, in milliseconds. Default is 0.
 * @param options The options to use.
 * @returns A throttled function, wrapping the specified function.
 */
export function throttle<TFunc extends Function>(func: TFunc, wait: number, options?: IThrottleOptions): TFunc & IThrottledFunc;

export function throttle(...args: any[]): any
{
    if (args[0] instanceof Function)
    {
        return createThrottledFunc(args[0], args[1], args[2]);
    }

    return function once<T>(target: any, key?: any, descriptor?: any): any
    {
        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            get: function getter(): Function
            {
                // Attach this function to the instance.
                Object.defineProperty(this, key,
                {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    value: createThrottledFunc(descriptor.value, args[0], args[1])
                });

                return this[key];
            }
        };
    };
}

// tslint:enable
