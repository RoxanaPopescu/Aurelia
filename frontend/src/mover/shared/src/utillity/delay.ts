import { AbortError } from "./abortError";

/**
 * Returns a promise that will be resolved when the specified time has elapsed,
 * or rejected if the specified abort signal is triggered.
 * @param time The time to wait before resolving the promise.
 * @param signal The abort signal to use, or undefined to use no abort signal.
 * @returns The delay promise.
 */
export async function delay(time: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // tslint:disable-next-line:no-any
    let timeoutHandle: any;

    if (signal != null) {
      if (signal.aborted) {
        reject(new AbortError());
        return;
      } else {
        signal.addEventListener("abort", () => {
          clearTimeout(timeoutHandle);
          reject(new AbortError());
        });
      }
    }

    timeoutHandle = setTimeout(resolve, time);
  });
}