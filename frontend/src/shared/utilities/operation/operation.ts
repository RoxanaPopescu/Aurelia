import { computedFrom } from "aurelia-binding";
import { AbortError } from "shared/types";

/**
 * Represents an async operation, that may succeede, fail with an error, or be aborted.
 */
// tslint:disable-next-line: invalid-void
export class Operation<TResult = void>
{
    /**
     * Creates a new instance of the type.
     * @param func The function to execute, which will be called immediately.
     */
    public constructor(func: (signal: AbortSignal) => Promise<TResult>)
    {
        // Create the abort controller.
        this._abortController = new AbortController();

        // Execute the function and get its promise.
        this.promise = func(this._abortController.signal);

        // tslint:disable-next-line: no-floating-promises
        this.promise
            .catch(error =>
            {
                // Throw if not caused by an abort.
                if (!(error instanceof AbortError) || !this._aborted)
                {
                    // Store the error on the operation.
                    this._error = error;

                    throw error;
                }
            })
            .finally(() =>
            {
                // Indicate that the operation is no longer pending.
                this._pending = false;
            });
    }

    /**
     * The abort controller for the current operation.
     */
    private readonly _abortController: AbortController;

    /**
     * True if the operation is pending, otherwise false.
     */
    private _pending = true;

    /**
     * True if the operation was aborted, otherwise false.
     */
    private _aborted = false;

    /**
     * The error that occurred, or undefined if the operation is pending or succeeded.
     */
    private _error: Error;

    /**
     * The promise for the operation.
     */
    public readonly promise: Promise<TResult>;

    /**
     * True if the operation is pending, otherwise false.
     */
    @computedFrom("_pending")
    public get pending(): boolean
    {
        return this._pending;
    }

    /**
     * True if the operation was aborted, otherwise false.
     */
    @computedFrom("_aborted")
    public get aborted(): boolean
    {
        return this._aborted;
    }

    /**
     * The error that occurred, or undefined if the operation is pending or succeeded.
     */
    @computedFrom("_error")
    public get error(): Error
    {
        return this._error;
    }

    /**
     * Aborts the operation, and rejects its promise with an `AbortError`.
     */
    public abort(): void
    {
        this._aborted = true;
        this._abortController.abort();
    }
}
