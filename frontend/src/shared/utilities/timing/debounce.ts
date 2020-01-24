// tslint:disable: no-parameter-reassignment no-invalid-this ban-types

/**
 * Represents the options to use when creating a debounced function.
 */
export interface IDebounceOptions
{
    /**
     * True to invoke the function on the leading edge, otherwise false.
     * Default is false.
     */
    leading?: boolean;

    /**
     * True to invoke the function on the trailing edge, otherwise false.
     * Default is true.
     */
    trailing?: boolean;

    /**
     * The maximum time to wait before invoking the function.
     * Default is undefined.
     */
    maxWait?: number;
}

/**
 * Represents a debounced function.
 */
export interface IDebouncedFunc extends Function
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
 * Creates a debounced function, wrapping the specified function.
 * @param func The function to debounce.
 * @param wait The wait period, in milliseconds.
 * @param options The options to use.
 * @returns A debounced function, wrapping the specified function.
 */
function createDebouncedFunc<TFunc extends Function>(func: TFunc, wait = 0, options?: IDebounceOptions): TFunc & IDebouncedFunc
{
    let lastArgs: any;
    let lastThis: any;
    let maxWait: number | undefined;
    let result: any;
    let timerId: any;
    let lastCallTime: number | undefined;

    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    if (typeof func !== "function")
    {
        throw new TypeError("Expected a function");
    }

    wait = +wait || 0;

    if (options != null)
    {
        leading = !!options.leading;
        maxing = "maxWait" in options;
        maxWait = maxing ? Math.max(+(options.maxWait || 0), wait) : maxWait;
        trailing = "trailing" in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time: number): any
    {
        const args = lastArgs;
        const thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);

        return result;
    }

    function leadingEdge(time: number): any
    {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;

        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);

        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time: number): number
    {
        const timeSinceLastCall = time - lastCallTime!;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const remaining = wait - timeSinceLastCall;

        return maxing ? Math.min(remaining, maxWait! - timeSinceLastInvoke) : remaining;
    }

    function shouldInvoke(time: number): boolean
    {
        const timeSinceLastCall = time - lastCallTime!;
        const timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
            (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait!));
    }

    function timerExpired(): any
    {
        const time = Date.now();

        if (shouldInvoke(time))
        {
            return trailingEdge(time);
        }

        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time: number): any
    {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs)
        {
            return invokeFunc(time);
        }

        lastArgs = lastThis = undefined;

        return result;
    }

    function cancel(): void
    {
        if (timerId !== undefined)
        {
            clearTimeout(timerId);
        }

        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush(): any
    {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function debounced(this: any, ...args: any[]): any
    {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastThis = this;
        lastArgs = args;
        lastCallTime = time;

        if (isInvoking)
        {
            if (timerId === undefined)
            {
                return leadingEdge(lastCallTime);
            }

            if (maxing)
            {
                // Handle invocations in a tight loop.
                timerId = setTimeout(timerExpired, wait);

                return invokeFunc(lastCallTime);
            }
        }

        if (timerId === undefined)
        {
            timerId = setTimeout(timerExpired, wait);
        }

        return result;
    }

    (debounced as any).cancel = cancel;
    (debounced as any).flush = flush;

    return debounced as any;
}

/**
 * Decorates a class method such that invocation is delayed until the specified
 * wait period have elapsed since the most recent call to the method.
 *
 * The method is always invoked with the arguments provided in the most recent call.
 * Any debounced calls to the method return the result of the most recent invocation.
 *
 * Additional options may be provided to indicate whether the method should
 * be invoked on the leading and/or trailing edge of the wait periodt.
 *
 * Note that if `leading` and `trailing` options are true, the method is invoked on
 * the trailing edge of the wait period, only if the method is called more
 * than once during the wait period. If the wait period is 0 and `leading` is false,
 * method invocation is deferred until the next tick.
 *
 * Note that the debounced method is extended with a `cancel` method to cancel
 * any delayed invocations and a `flush` method to execute them immediately.
 *
 * For an explanation of the difference between debouncing and throttling,
 * see: https://css-tricks.com/debouncing-throttling-explained-examples
 *
 * @param wait The wait period, in milliseconds.
 * @param options The options to use.
 */
export function debounce<TFunc extends Function>(wait: number, options?: IDebounceOptions): any;

/**
 * Creates a debounced function that wraps the specified function, such that invocation
 * of the function is delayed until the specified wait period have elapsed since the most
 * recent call to the function.
 *
 * The function is always invoked with the arguments provided in the most recent call.
 * Any debounced calls to the function return the result of the most recent invocation.
 *
 * Additional options may be provided to indicate whether the function should
 * be invoked on the leading and/or trailing edge of the wait periodt.
 *
 * Note that if `leading` and `trailing` options are true, the function is invoked on
 * the trailing edge of the wait period, only if the function is called more
 * than once during the wait period. If the wait period is 0 and `leading` is false,
 * function invocation is deferred until the next tick.
 *
 * Note that the debounced function is extended with a `cancel` method to cancel
 * any delayed invocations and a `flush` method to execute them immediately.
 *
 * For an explanation of the difference between debouncing and throttling,
 * see: https://css-tricks.com/debouncing-throttling-explained-examples
 *
 * @param func The function to debounce.
 * @param wait The wait period, in milliseconds. Default is 0.
 * @param options The options to use.
 * @returns A debounced function, wrapping the specified function.
 */
export function debounce<TFunc extends Function>(func: TFunc, wait: number, options?: IDebounceOptions): TFunc & IDebouncedFunc;

export function debounce(...args: any[]): any
{
    if (args[0] instanceof Function)
    {
        return createDebouncedFunc(args[0], args[1], args[2]);
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
                    value: createDebouncedFunc(descriptor.value, args[0], args[1])
                });

                return this[key];
            }
        };
    };
}

// tslint:enable
