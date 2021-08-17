import { IResponseStubs } from "shared/infrastructure";
// import orderEvents from "./responses/order-events-all";
// import orderEvents from "./responses/order-events";
// import routesCreate from "./responses/routes-create";
// import expressRoutes from "./responses/express-routes";
// import orderGroups from "./responses/order-groups";
// import routeTemplates from "./responses/route-templates";
// import uploadOrders from "./responses/upload-orders";
// import routeDetails from "./responses/route-details";
// import routePlanningSettings from "./responses/route-planning-settings";
// import routePlans from "./responses/route-plans";
// import communication from "./responses/communication";
import identity from "./responses/identity";
import organizations from "./responses/organizations";
import account from "./responses/account";

/**
 * Here you can stub HTTP responses e.g. if the API is not yet available.
 * Just import the stub file with the responses and use destructuring to
 * merge it into the stubs object.
 *
 * ### Remember
 * - Organize the stubs into separate files, so they can be included as needed.
 * - Add comments explaining why the stubs are needed, and when to remove them.
 * - Maintain the stubs, so they always match the real responses.
 * - Remove the stubs when they are no longer needed.
 */
export const stubs: IResponseStubs =
{
    // ...expressRoutes
    // ...orderGroups
    // ...routeTemplates,
    // ...uploadOrders,
    // ...routeDetails,
    // ...routePlanningSettings,
    // ...routePlans,
    // ...communication,
    // ...routesCreate,
    // ...orderEvents,
    ...identity,
    ...organizations,
    ...account
};
