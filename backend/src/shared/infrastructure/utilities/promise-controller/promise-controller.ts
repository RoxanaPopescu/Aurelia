/**
 * Represents a controller for a promise, which exposes its resolve and reject functions,
 * thus making it possible to resolve or reject the promise from outside the scope of the
 * function passed to the promise constructor.
 */
export class PromiseController<T = void>
{
    /**
     * Creates a new instance of the type.
     */
    public constructor()
    {
        this.promise = new Promise<T>((resolve, reject) =>
        {
            this._resolve = resolve;
            this._reject = reject;
        });
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
}
