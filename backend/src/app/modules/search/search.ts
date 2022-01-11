import { DateTime } from "luxon";
import { AuthorizationError } from "../../../shared/types";
import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";
import { IFakeResponse } from "../../middleware/fetch-middleware";

// The default limit to use, if not specified in the query.
const defaultQueryLimit = 10;

/**
 * Represents a module exposing endpoints related to route details
 */
export class RoutesModule extends AppModule
{
    /**
     * Gets info about the entities matching the specified query text.
     * @param context.params.text The query text.
     * @param context.params.limit The max number of results to return for each entity type, or undefined to use the default.
     * @returns
     * - 200: An array of objects representing info about the entities.
     */
    public "GET /v2/searches/query" = async (context: AppContext) =>
    {
        await context.authorize();

        const queryLimit = context.query.limit ? parseInt(context.query.limit as string) : defaultQueryLimit;
        const queryText = context.query.text as string;

        const
        [
            ordersResponse,
            routesResponse,
            routeTemplates,
            routePlansResponse,
            ruleSets,
            orderGroups,
            distributionCenters,
            communcationTriggers,
            drivers,
            vehicles,
            users,
            teams,
            roles,
            connections
        ]
        = await Promise.all(
        [
            this.tryFetch(context, "POST /v2/orders/list",
            {
                body:
                {
                    page: 1,
                    pageSize: queryLimit,
                    sorting: [{ field: 6, direction: 2 }],
                    filter: [context.query.text]
                }
            }),

            this.tryFetch(context, "POST /v2/routes/list",
            {
                body:
                {
                    page: 1,
                    pageSize: queryLimit,
                    sorting: { field: 4, direction: 2 },
                    searchQuery: context.query.text,
                    include: { owner: true },

                    // HACK: This request times out if we don't limit the search to recent routes.
                    startTimeFrom: DateTime.utc().minus({ days: 14 })
                }
            }),

            this.tryFetch(context, "POST /v2/routes/templates/list"),

            this.tryFetch(context, "POST /v2/route-planning/plans/list",
            {
                body:
                {
                    page: 1,
                    pageSize: queryLimit,
                    searchQuery: context.query.text
                }
            }),

            this.tryFetch(context, "GET /v2/route-planning/rule-sets"),

            this.tryFetch(context, "POST /v2/route-planning/order-groups/list"),

            this.tryFetch(context, "GET /v2/distribution-centers"),

            this.tryFetch(context, "GET /v2/communication/triggers"),

            this.tryFetch(context, "POST /v2/drivers/list",
            {
                body:
                {
                    paging:
                    {
                        page: 1,
                        pageSize: queryLimit
                    },
                    sorting:
                    {
                        property: "name",
                        direction: "ascending"
                    },
                    filter:
                    {
                        searchQuery: context.query.text
                    }
                }
            }),

            this.tryFetch(context, "POST /v2/vehicles/list"),

            this.tryFetch(context, "GET /v2/organizations/:organizationId/users",
            {
                params:
                {
                    organizationId: context.user!.organizationId
                }
            }),

            this.tryFetch(context, "GET /v2/organizations/:organizationId/teams",
            {
                params:
                {
                    organizationId: context.user!.organizationId
                }
            }),

            this.tryFetch(context, "GET /v2/organizations/:organizationId/roles",
            {
                params:
                {
                    organizationId: context.user!.organizationId
                }
            }),

            this.tryFetch(context, "GET /v2/organizations/:organizationId/connections",
            {
                params:
                {
                    organizationId: context.user!.organizationId
                }
            })
        ]);

        context.response.body =
        [
            ...this.limit((ordersResponse?.body?.orders ?? []).map((entity: any) =>
            ({
                type: "order",
                id: entity.internalId,
                slug: entity.publicId,
                name: entity.publicId,
                description: entity.relationalId
            })),
            queryLimit),

            ...this.limit((routesResponse?.body?.routes ?? []).map((entity: any) =>
            ({
                type: "route",
                id: entity.id,
                slug: entity.slug,
                name: entity.slug,
                description: entity.reference,
                parent: entity.owner == null ? undefined :
                {
                    type: entity.owner.companyName ? "organization" : "unknown",
                    id: entity.owner.id,
                    name: entity.owner.companyName ?? entity.owner.contactPerson
                }
            })),
            queryLimit),

            ...this.filter((routeTemplates?.body?.results ?? []).map((entity: any) =>
            ({
                type: "route-template",
                id: entity.id,
                slug: entity.slug,
                name: entity.name,
                description: entity.reference
            })),
            queryText, queryLimit),

            ...this.limit((routePlansResponse?.body?.results ?? []).map((entity: any) =>
            ({
                type: "route-plan",
                id: entity.id,
                name: entity.name
            })),
            queryLimit),

            ...this.filter((ruleSets?.body?.results ?? []).map((entity: any) =>
            ({
                type: "route-planning-rule-set",
                id: entity.id,
                slug: entity.slug,
                name: entity.name
            })),
            queryText, queryLimit),

            ...this.filter((orderGroups?.body ?? []).map((entity: any) =>
            ({
                type: "order-group",
                id: entity.id,
                name: entity.name
            })),
            queryText, queryLimit),

            ...this.filter((distributionCenters?.body ?? []).map((entity: any) =>
            ({
                type: "distribution-center",
                id: entity.id,
                name: entity.name,
                description: `${entity.location?.address?.primary ?? ""} ${entity.location?.address?.secondary ?? ""}`.trim() ?? undefined
            })),
            queryText, queryLimit),

            ...this.filter((communcationTriggers?.body ?? []).map((entity: any) =>
            ({
                type: "communication-trigger",
                id: entity.id,
                slug: entity.slug,
                name: entity.name
            })),
            queryText, queryLimit),

            ...this.limit((drivers?.body?.results ?? []).map((result: any) =>
            ({
                type: "driver",
                id: result.driver.id,
                name: `${result.driver.name?.first ?? ""} ${result.driver.name?.last ?? ""}`.trim() ?? result.driver.id
            })),
            queryLimit),

            ...this.filter((vehicles?.body?.results ?? []).map((entity: any) =>
            ({
                type: "vehicle",
                id: entity.id,
                name: entity.name || [entity.make, entity.model, entity.productionYear].filter(e => e).join(", "),
                description: entity.licensePlate
            })),
            queryText, queryLimit),

            ...this.filter((users?.body ?? []).map((entity: any) =>
            ({
                type: "user",
                id: entity.id,
                name: entity.fullName,
                description: entity.email
            })),
            queryText, queryLimit),

            ...this.filter((teams?.body ?? []).map((entity: any) =>
            ({
                type: "team",
                id: entity.id,
                name: entity.name
            })),
            queryText, queryLimit),

            ...this.filter((roles?.body ?? []).map((entity: any) =>
            ({
                type: "role",
                id: entity.id,
                name: entity.name
            })),
            queryText, queryLimit),

            ...this.filter((connections?.body ?? []).map((entity: any) =>
            ({
                type: "connection",
                id: entity.id,
                name: entity.organization.name
            })),
            queryText, queryLimit)
        ];

        context.response.status = 200;
    }

    /**
     * Limits the specified entity info array to the specified max length.
     * @param entityInfos The array of entity infos to limit.
     * @param limit The max number of entities to return.
     * @returns The limited array of entity infos.
     */
    private limit(entityInfos: any[], limit: number): any[]
    {
        return entityInfos
            .slice(0, limit);
    }

    /**
     * Filters the specified array of entity infos to include only those
     * that contains the specified query text, ignoring case.
     * This also limits the number of results to `queryLimit`.
     * @param entityInfos The entity infos to filter.
     * @param queryText The query text.
     * @param limit The max number of entities to return.
     * @returns The filtered array of entity infos.
     */
    private filter(entityInfos: any[], queryText: string, limit: number): any[]
    {
        const lowerCaseQueryText = queryText.toLowerCase();

        return entityInfos
            .filter(entityInfo =>
                entityInfo.id?.toLowerCase().includes(lowerCaseQueryText) ||
                entityInfo.slug?.toLowerCase().includes(lowerCaseQueryText) ||
                entityInfo.name?.toLowerCase().includes(lowerCaseQueryText) ||
                entityInfo.description?.toLowerCase().includes(lowerCaseQueryText))
            .slice(0, limit);
    }

    /**
     * Makes an internal request to the specified endpoint, returning the response
     * if successful, or undefined if any authorization error occurs.
     * @param context The current context.
     * @param endpoint The endpoint to fetch.
     * @param request The fake request object.
     * @returns A promise that will be resolved with the fake response object.
     */
    private async tryFetch(context: AppContext, endpoint: string, request?: any): Promise<IFakeResponse | undefined>
    {
        try
        {
            return await context.fetch(endpoint, request);
        }
        catch (error)
        {
            if (error instanceof AuthorizationError)
            {
                console.warn(error);

                return undefined;
            }

            throw error;
        }
    }
}
