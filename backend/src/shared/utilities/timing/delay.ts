// tslint:disable-next-line: no-submodule-imports
import { AbortSignal } from "abort-controller";
import { AbortError } from "../../../shared/types";

/**
 * Returns a promise that will be resolved when the specified time has elapsed.
 * Alternatively, if the specified signal is triggered, the promise will by default
 * be rejected with an `AbortError`, but can be configured to be resolved instead.
 * @param time The time in milliseconds to wait before resolving the promise.
 * @param signal The abort signal to use, or undefined to use no abort signal.
 * @param throwOnAbort True to throw an `AbortError` if the specified abort signal is triggered, false to resolve the promise.
 * @returns The delay promise.
 */
export async function delay(time: number, signal?: AbortSignal, throwOnAbort = true): Promise<void>
{
    return new Promise<void>((resolve, reject) =>
    {
        if (signal != null)
        {
            const abortHandler = throwOnAbort
                ? () => reject(new AbortError())
                : () => resolve();

            if (signal.aborted)
            {
                abortHandler();

                return;
            }

            signal.addEventListener("abort", () =>
            {
                clearTimeout(timeoutHandle);
                abortHandler();
            });
        }

        const timeoutHandle = setTimeout(resolve, time);
    });
}
