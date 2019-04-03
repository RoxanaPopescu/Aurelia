import { IResponseStubs } from "shared/infrastructure";
import account from "./responses/account";
import vehicleTypes from "./responses/vehicle-types";
import routes from "./responses/routes";
import route from "./responses/route";
import orders from "./responses/orders";
import order from "./responses/order";

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
    ...account,
    ...vehicleTypes,
    ...routes,
    ...route,
    ...orders,
    ...order
};
