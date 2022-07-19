import { ListViewDefinition } from "../entities/list-view-definition";
import { ListViewType } from "../entities/list-view-type";
import { RouteListViewDefinition } from "../entities/route/route-list-view-definition";
import { OrderListViewDefinition } from "../entities/order/order-list-view-definition";

/**
 * Factory method for creating instances of type `ListViewDefinition`.
 * @param type The type of list view definition to create.
 * @returns A `ListViewDefinition` instance of the appropiate type.
 */
export function createListViewDefinition(type: ListViewType): ListViewDefinition<any>;

/**
 * Factory method for creating instances of type `ListViewDefinition`.
 * @param data The response data from which the instance should be created.
 * @returns A `ListViewDefinition` instance of the appropiate type.
 */
export function createListViewDefinition(data: any): ListViewDefinition<any>;

/**
 * Factory method for creating instances of type `ListViewDefinition`.
 * @param typeOrData The type of list view definition to create, or the response data from which the instance should be created.
 * @returns A `ListViewDefinition` instance of the appropiate type.
 */
export function createListViewDefinition(typeOrData: ListViewType | any): ListViewDefinition<any>
{
    const type = typeof typeOrData === "string" ? typeOrData : typeOrData.type as ListViewType;
    const data = typeof typeOrData === "string" ? undefined : typeOrData;

    switch (type)
    {
        case "route": return new RouteListViewDefinition(data);
        case "order": return new OrderListViewDefinition(data);
        default: throw new Error("Unknown list view type.");
    }
}
