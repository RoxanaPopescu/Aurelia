/**
 * Represents the information needed to identify a route.
 */
export interface RouteReference {

  /**
   * The ID identifying the route.
   */
  id: string;

  /**
   * The slug identifying the route.
   */
  slug: string;

  /**
   * The non-unique reference for the route,
   * or undefined no reference has been assigned.
   */
  reference?: string;

}