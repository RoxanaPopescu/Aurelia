import { Log } from "../logging";

/**
 * Represents the type of storage targeted by a `WebStorage` instance.
 */
export type WebStorageType = "local" | "session";

/**
 * Represents an abstraction around the Web Storage API, targeting either `local` or `session` storage,
 * with automatic JSON serialization and deserialization and safer error handling.
 */
export class WebStorageInstance
{
    /**
     * Creates a new instance of the type.
     * @param type The type of store to use.
     */
    public constructor(type: WebStorageType)
    {
        this._type = type;
        this._store = window[`${type}Storage`];
    }

    private readonly _type: WebStorageType;
    private readonly _store: Storage;
    private _hasNotifiedUserOfError = false;

    /**
     * Gets the value for the specified key.
     * @param key The key for which the value should be returned.
     * @returns The value for the specified key, or undefined if no value is set.
     */
    public get<T>(key: string): T | undefined
    {
        try
        {
            const value = this._store.getItem(key);

            return value == null ? undefined : JSON.parse(value);
        }
        catch (error)
        {
            this.logError(`Failed to get value from ${this._type} storage.`, error);

            return undefined;
        }
    }

    /**
     * Sets the value for the specified key.
     * @param key The key for which the value should be set, or undefined to remove the value.
     * @param value The value to set.
     * @returns True if the operation succeeded, otherwise false.
     */
    public set<T>(key: string, value: T): boolean
    {
        if (value !== undefined)
        {
            try
            {
                this._store.setItem(key, JSON.stringify(value));
            }
            catch (error)
            {
                this.logError(`Failed to set value in ${this._type} storage.`, error);

                return false;
            }
        }
        else
        {
            try
            {
                this._store.removeItem(key);
            }
            catch (error)
            {
                this.logError(`Failed to remove value from ${this._type} storage.`, error);

                return false;
            }
        }

        return true;
    }

    /**
     * Clears all values in the storage.
     * @returns True if the operation succeeded, otherwise false.
     */
    public clear(): boolean
    {
        try
        {
            this._store.clear();
        }
        catch (error)
        {
            this.logError(`Failed to clear ${this._type} storage.`, error);

            return false;
        }

        return true;
    }

    /**
     * Logs the specified error message and instance.
     * If this is the first error being logged, the user will be notified with a toast.
     * @param message The error message to log.
     * @param error The error instance to log.
     */
    private logError(message: string, error: Error): void
    {
        console.error(message, error);

        if (!this._hasNotifiedUserOfError)
        {
            Log.error(`An error occurred while accessing ${this._type} storage, which may impact the stability of the app`, error);

            this._hasNotifiedUserOfError = true;
        }
    }
}
