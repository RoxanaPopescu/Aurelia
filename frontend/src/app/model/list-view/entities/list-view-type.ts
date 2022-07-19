import { RouteListViewDefinition } from "./route/route-list-view-definition";
import { OrderListViewDefinition } from "./order/order-list-view-definition";

/**
 * Represents the type of a list view.
 */
export type ListViewType = RouteListViewDefinition["type"] | OrderListViewDefinition["type"];
