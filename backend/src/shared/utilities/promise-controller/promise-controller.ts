// tslint:disable-next-line: no-submodule-imports
import { AbortSignal } from "abort-controller";
import { AbortError } from "../../../shared/types";

/**
 * Represents a controller for a promise, which exposes its resolve and reject functions,
 * thus making it possible to resolve or reject the promise from outside the scope of the
 * function passed to the promise constructor.
 */
// tslint:disable-next-line: invalid-void
export class PromiseController<T = void>
{
    /**
     * Creates a new instance of the type.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     */
    public constructor(signal?: AbortSignal)
    {
        this.promise = new Promise<T>((resolve, reject) =>
        {
            this._resolve = resolve;
            this._reject = reject;
        });

        if (signal != null)
        {
            if (signal.aborted)
            {
                this.reject(new AbortError());

                return;
            }

            signal.addEventListener("abort", () =>
            {
                this.reject(new AbortError());
            });
        }
    }

    private _resolve: (value: T) => void;
    private _reject: (reason: any) => void;

    /**
     * The promise wrapped by this promise source.
     */
    public readonly promise: Promise<T>;

    /**
     * Function that, when called, resolves the promise wrapped by this promise source.
     * @param reason The value with which the promise should be resolved.
     */
    public get resolve(): (value: T) => void
    {
        return this._resolve;
    }

    /**
     * Function that, when called, rejects the promise wrapped by this promise source.
     * @param reason The reason with which the promise should be rejected.
     */
    public get reject(): (reason: any) => void
    {
        return this._reject;
    }

    /**
     * Function that, when called, rejects the promise wrapped by this promise source,
     * providing an `AbortError` as reason.
     * @param reason The reason for the abort, used when creating the `AbortError` instance.
     */
    public abort(reason: any): void
    {
        this._reject(new AbortError(reason));
    }
}
