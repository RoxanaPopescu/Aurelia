import { computedFrom } from "aurelia-binding";
import { AbortError } from "../errors/abort-error";

/**
 * Represents an async operation, that may succeede, fail with an error, or be aborted.
 */
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
                // Store the error on the operation.
                this._error = error;

                // Throw if not caused by an abort.
                if (!(error instanceof AbortError))
                {
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
        this._abortController.abort();
    }
}
