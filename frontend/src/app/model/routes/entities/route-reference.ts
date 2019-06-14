/**
 * Represents the information needed to identify a route.
 */
export interface IRouteReference
{
    /**
     * The ID of the route.
     */
    id: string;

    /**
     * The slug identifying the route.
     */
    slug: string;

    /**
     * The non-unique reference for the route,
     * or undefined if no reference has been assigned.
     */
    reference?: string;

}
