import { computedFrom } from "aurelia-framework";

/**
 * Represents an instance that may be disposed.
 */
export interface IDisposable
{
    /**
     * Disposes the instance.
     */
    dispose(): void;
}

/**
 * Represents a handle that may be disposed.
 */
export class Disposable implements IDisposable
{
    /**
     * Creates a new instance of the type.
     * @param callback The function to call when the handle is disposed.
     */
    public constructor(callback: () => any)
    {
        this._callback = callback;
    }

    private readonly _callback: () => any;
    private _disposed = false;

    /**
     * True if the handle is disposed, otherwise false.
     */
    @computedFrom("_disposed")
    public get disposed(): boolean
    {
        return this._disposed;
    }

    /**
     * Disposes the handle.
     */
    public dispose(): void
    {
        if (!this._disposed)
        {
            this._disposed = true;
            this._callback();
        }
    }
}
