import { IPaging, ISorting } from "../shared/types";

/**
 * Represents the custom properties and methods added to the context.
 */
export interface IAppContext
{
    /**
     * The paging to use, if specified.
     */
    paging?: IPaging;

    /**
     * The sorting to use, if specified.
     */
    sorting?: ISorting;

    /**
     * Verifies that the user is authenticated, and that the user has all
     * the specified claims. If authorization fails, an error will be thrown,
     * which eventually results in an 401 response.
     * @param claims The claims required for authorization to succeede.
     */
    authorize(...claims: string[]): void;

    /**
     * Marks any code that is executed after the call to this method as internal.
     * This means, that if an `ApiError` occurs, the response status will no longer
     * be forwarded to the client, but instead result in a response with status 500,
     * meaning `Internal server error`.
     */
    internal(): void;
}
