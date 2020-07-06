// The route ID's that have been flagged by the user.
const flaggedRouteIds = new Map<string, boolean>();

/**
 * Represents a service that manages the flags associated with the routes.
 */
export class RouteFlagService {

  /**
   * Toggles the flag state associated with the route.
   * @param routeId The ID of the route for which the flag state should be toggled.
   */
  public toggleFlag(routeId: string) {
    flaggedRouteIds.set(routeId, !flaggedRouteIds.get(routeId));
  }

  /**
   * Toggles the flag state associated with the route.
   * @param routeId The ID of the route for which the flag state should be returned.
   * @returns True if the route is flagged, otherwise false.
   */
  public isFlagged(routeId: string): boolean {
    return !!flaggedRouteIds.get(routeId);
  }
}

/**
 * The singleton instance of the `RouteFlagService`.
 */
export const routeFlagService = new RouteFlagService();