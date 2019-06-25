/**
 * Represents the error thrown when the operation is not authorized.
 */
export class AuthorizationError extends Error
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
        Object.setPrototypeOf(this, AuthorizationError.prototype);

        this.name = "AuthorizationError";
        this.message = message || "The operation was not authorized.";
    }
}
