/**
 * Represents the error thrown when authentication fails.
 */
export class AuthenticationError extends Error
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
        Object.setPrototypeOf(this, AuthenticationError.prototype);

        this.name = "AuthenticationError";
        this.message = message || "Authentication failed.";
    }
}

/**
 * Represents the error thrown when authorization fails.
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
        this.message = message || "Authorization failed.";
    }
}
