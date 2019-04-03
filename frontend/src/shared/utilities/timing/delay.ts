import { AbortError } from "shared/types";

/**
 * Returns a promise that will be resolved when the specified time has elapsed,
 * or rejected with an `AbortError` if the specified abort signal is triggered.
 * @param time The time in milliseconds to wait before resolving the promise.
 * @param abortSignal The abort signal to use, or undefined to use no abort signal.
 * @returns The delay promise.
 */
export async function delay(time: number, abortSignal?: AbortSignal): Promise<void>
{
    return new Promise<void>((resolve, reject) =>
    {
        if (abortSignal != null)
        {
            if (abortSignal.aborted)
            {
                reject(new AbortError());

                return;
            }
            else
            {
                abortSignal.addEventListener("abort", () =>
                {
                    clearTimeout(timeoutHandle);
                    reject(new AbortError());
                });
            }
        }

        const timeoutHandle = setTimeout(resolve, time);
    });
}
