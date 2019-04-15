/**
 * Represents the error thrown when an operation is aborted.
 */
export class AbortError extends Error {
  
  /**
   * Creates a new instance of the type.
   * @param message The message describing the error.
   */
  public constructor(message?: string) {
    super();

    // Required to ensure a correct prototype chain.
    Object.setPrototypeOf(this, AbortError.prototype);

    this.name = "AbortError";
    this.message = message || "The operation was aborted.";
  }
}