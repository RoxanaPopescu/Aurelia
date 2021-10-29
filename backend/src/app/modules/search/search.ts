import { DateTime } from "luxon";
import { AuthenticationError, Type } from "../../../shared/types";
import { ApiError, container } from "../../../shared/infrastructure";
import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";
import { RoutesListModule } from "../routes/modules/list/list";
import { OrdersModule } from "../orders/orders";
import { RoutePlanningPlansModule } from "../route-planning/modules/plans/plans";
import { RoutePlanningOrderGroupsModule } from "../route-planning/modules/order-groups/order-groups";
import { RoutePlanningRuleSetsModule } from "../route-planning/modules/rule-sets/rule-sets";
import { RouteTemplatesModule } from "../routes/modules/templates/templates";
import { DistributionCenterModule } from "../distribution-centers/distribution-centers";
import { DriversModule } from "../drivers/drivers";
import { VehiclesModule } from "../vehicles/vehicles";
import { TriggersModule } from "../communication/modules/triggers/triggers";
import { OrganizationModule } from "../organization/organization";

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

        const
        [
            ordersResponse,
            routesResponse,
            routeTemplates,
            routePlansResponse,
            ruleSets,
            orderGroups,
            distributionCenters,
            drivers,
            vehicles,
            communcationTriggers,
            users,
            teams,
            roles,
            connections
        ]
        = await Promise.all(
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
                    include: { owner: true },

                    // HACK: This request times out if we don't limit the search to recent routes.
                    startTimeFrom: DateTime.utc().minus({ weeks: 2 })
                }
            }),

            this.getResponse(RouteTemplatesModule, "POST /v2/routes/templates/list", context),

            this.getResponse(RoutePlanningPlansModule, "POST /v2/route-planning/plans/list", context,
            {
                body:
                {
                    page: 1,
                    pageSize: 10,
                    searchQuery: context.query.text
                }
            }),

            this.getResponse(RoutePlanningRuleSetsModule, "GET /v2/route-planning/rule-sets", context),

            this.getResponse(RoutePlanningOrderGroupsModule, "POST /v2/route-planning/order-groups/list", context,
            {
                body:
                {
                    paging:
                    {
                        page: 1,
                        pageSize: 10
                    },
                    filter: context.query.text
                }
            }),

            this.getResponse(DistributionCenterModule, "GET /v2/distribution-centers", context),

            this.getResponse(DriversModule, "POST /v2/drivers/list", context,
            {
                body:
                {
                    paging:
                    {
                        page: 1,
                        pageSize: 10
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

            this.getResponse(VehiclesModule, "POST /v2/vehicles/list", context),

            this.getResponse(TriggersModule, "GET /v2/communication/triggers", context),

            this.getResponse(OrganizationModule, "GET /v2/organizations/:organizationId/users", context,
            {
                params:
                {
                    organizationId: context.user?.organizationId
                }
            }),

            this.getResponse(OrganizationModule, "GET /v2/organizations/:organizationId/teams", context,
            {
                params:
                {
                    organizationId: context.user?.organizationId
                }
            }),

            this.getResponse(OrganizationModule, "GET /v2/organizations/:organizationId/roles", context,
            {
                params:
                {
                    organizationId: context.user?.organizationId
                }
            }),

            this.getResponse(OrganizationModule, "GET /v2/organizations/:organizationId/connections", context,
            {
                params:
                {
                    organizationId: context.user?.organizationId
                }
            })
        ]);

        context.response.body =
        [
            ...(ordersResponse?.body?.orders ?? []).map((entity: any) =>
            ({
                type: "order",
                id: entity.internalId,
                slug: entity.publicId,
                name: entity.publicId,
                description: entity.relationalId
            })),

            ...(routesResponse?.body?.routes ?? []).map((entity: any) =>
            ({
                type: "route",
                id: entity.id,
                slug: entity.slug,
                name: entity.slug,
                description: entity.reference,
                parent:
                {
                    type: "organization",
                    name: entity.owner.companyName
                }
            })),

            ...this.filter((routeTemplates?.body?.results ?? []).map((entity: any) =>
            ({
                type: "route-template",
                id: entity.id,
                slug: entity.slug,
                name: entity.name,
                description: entity.reference
            })),
            context.query.text as string),

            ...(routePlansResponse?.body?.results ?? []).map((entity: any) =>
            ({
                type: "route-plan",
                id: entity.id,
                name: entity.name
            })),

            ...this.filter((ruleSets?.body?.results ?? []).map((entity: any) =>
            ({
                type: "rule-set",
                id: entity.id,
                slug: entity.slug,
                name: entity.name
            })),
            context.query.text as string),

            ...(orderGroups?.body ?? []).map((entity: any) =>
            ({
                type: "order-group",
                id: entity.id,
                slug: entity.slug,
                name: entity.name
            })),

            ...this.filter((distributionCenters?.body ?? []).map((entity: any) =>
            ({
                type: "distribution-center",
                id: entity.id,
                name: entity.name,
                description: `${entity.location?.address?.primary ?? ""} ${entity.location?.address?.secondary ?? ""}`.trim() ?? undefined
            })),
            context.query.text as string),

            ...(drivers?.body?.results ?? []).map((result: any) =>
            ({
                type: "driver",
                id: result.driver.id,
                name: `${result.driver.name?.first ?? ""} ${result.driver.name?.last ?? ""}`.trim() ?? undefined
            })),

            ...this.filter((vehicles?.body?.results ?? []).map((entity: any) =>
            ({
                type: "vehicle",
                id: entity.id,
                name: entity.name || [entity.make, entity.model, entity.productionYear].filter(e => e).join(", "),
                description: entity.licensePlate
            })),
            context.query.text as string),

            ...this.filter((communcationTriggers?.body ?? []).map((entity: any) =>
            ({
                type: "communication-trigger",
                id: entity.id,
                slug: entity.slug,
                name: entity.name
            })),
            context.query.text as string),

            ...this.filter((users?.body ?? []).map((entity: any) =>
            ({
                type: "user",
                id: entity.id,
                name: entity.fullName,
                description: entity.email
            })),
            context.query.text as string),

            ...this.filter((teams?.body ?? []).map((entity: any) =>
            ({
                type: "team",
                id: entity.id,
                name: entity.name
            })),
            context.query.text as string),

            ...this.filter((roles?.body ?? []).map((entity: any) =>
            ({
                type: "role",
                id: entity.id,
                name: entity.name
            })),
            context.query.text as string),

            ...this.filter((connections?.body ?? []).map((entity: any) =>
            ({
                type: "connection",
                id: entity.id,
                name: entity.organization.name
            })),
            context.query.text as string)
        ];

        context.response.status = 200;
    }

    private filter(entityInfos: any[], queryText: string): any[]
    {
        const lowerCaseQueryText = queryText.toLowerCase();

        return entityInfos.filter(entityInfo =>
            entityInfo.id?.toLowerCase().includes(lowerCaseQueryText) ||
            entityInfo.slug?.toLowerCase().includes(lowerCaseQueryText) ||
            entityInfo.name?.toLowerCase().includes(lowerCaseQueryText) ||
            entityInfo.description?.toLowerCase().includes(lowerCaseQueryText)
        );
    }

    private async getResponse(module: Type, endpoint: string, context: AppContext, request?: any): Promise<any>
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

            headers: request?.headers ?? context.headers,
            query: request?.query,
            params: request?.params,
            request:
            {
                headers: request?.headers ?? context.headers,
                query: request?.query,
                body: request?.body
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
            if (error instanceof AuthenticationError)
            {
                console.warn(error);

                return undefined;
            }

            throw error;
        }
    }
}
