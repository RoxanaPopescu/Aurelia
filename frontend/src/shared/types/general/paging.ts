/**
 * Represents the paging options to use for an API request.
 */
export interface IPaging
{
    /**
     * The current page number, starting from 1.
     */
    page: number;

    /**
     * The max number of items to show on a page.
     */
    pageSize: number;
}
