import { Type } from "../../../shared/types";
import { container } from "../../../shared/infrastructure";
import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";
import { RoutesListModule } from "../routes/modules/list/list";
import { OrdersModule } from "../orders/orders";

/**
 * Represents a module exposing endpoints related to route details
 */
export class RoutesModule extends AppModule
{
    /**
     * Gets info about the entities matching the specified query text.
     * @param context.params.text The query text.
     * @returns
     * - 200: An array of objects representing info about the entities.
     */
    public "GET /v2/searches/query" = async (context: AppContext) =>
    {
        await context.authorize();

        const [ordersResponse, routesResponse] = await Promise.all(
        [
            this.getResponse(OrdersModule, "POST /v2/orders/list", context,
            {
                body:
                {
                    page: 1,
                    pageSize: 10,
                    sorting: [{ field: 6, direction: 2 }],
                    filter: [context.query.text]
                }
            }),

            this.getResponse(RoutesListModule, "POST /v2/routes/list", context,
            {
                body:
                {
                    page: 1,
                    pageSize: 10,
                    sorting: { field: 4, direction: 2 },
                    searchQuery: context.query.text,
                    include: { owner: true }
                }
            })
        ]);

        context.response.body =
        [
            ...ordersResponse?.body.orders.map((order: any) =>
            ({
                type: "order",
                id: order.internalId,
                slug: order.publicId,
                name: order.publicId,
                data: undefined,
                starred: undefined
            })),

            ...routesResponse?.body.routes.map((route: any) =>
            ({
                type: "route",
                id: route.id,
                slug: route.slug,
                name: route.slug,
                data: undefined,
                starred: undefined,
                parent:
                {
                    type: "organization",
                    id: undefined,
                    slug: undefined,
                    name: route.owner.companyName,
                    data: undefined,
                    starred: undefined
                }
            }))
        ];

        context.response.status = 200;
    }

    private async getResponse(module: Type, endpoint: string, context: AppContext, request: any): Promise<any>
    {
        const fakeContext =
        {
            // tslint:disable: no-unbound-method
            user: context.user,
            paging: context.paging,
            sorting: context.sorting,
            authorize: context.authorize,
            internal: context.internal,
            // tslint:enable

            request:
            {
                headers: request.headers ?? context.headers,
                params: request.params,
                query: request.query,
                body: request.body
            },

            response:
            {
                status: undefined,
                body: undefined
            }
        };

        try
        {
            await container.get(module)[endpoint](fakeContext);

            return fakeContext.response;
        }
        catch (error)
        {
            return undefined;
        }
    }
}
