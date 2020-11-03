/**
 * Represents the error thrown when an operation is aborted.
 */
export class AbortError extends Error
{
    /**
     * Creates a new instance of the type.
     * @param message The message describing the error.
     */
    public constructor(message?: string)
    {
        super();

        // Required to ensure a correct prototype chain.
        // See: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, AbortError.prototype);

        this.name = "AbortError";
        this.message = message || "The operation was aborted.";
    }
}
