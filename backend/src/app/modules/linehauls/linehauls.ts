import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";
import { v4 as uuidV4 } from "uuid";

/**
 * Represents a module exposing endpoints related to linehauls.
 */
export class LinehaulsModule extends AppModule
{
    /**
     * Get a specific linehaul
     * @param context.params.id The ID of the linehaul to get.
     * @returns The linehaul with the specified id.
     * @returns 400 if not found.
     */
    public "GET /v2/linehauls/:id" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get("linehaulservice-api/v1/linehauls/find-by-id",
        {
            query:
            {
                id: context.params.id,
                ownerId: context.params.ownerId ?? context.user?.organizationId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Creates a linehaul with a auto generated GUID reference
     * @returns The created linehaul.
     */
    public "POST /v2/linehauls" = async (context: AppContext) =>
    {
        await context.authorize();

        const id = context.request.body.id ?? uuidV4();
        await this.apiClient.post("linehaulservice-api/v1/linehauls/create",
        {
            body:
            {
                id: id
            }
        });

        const result = await this.apiClient.get("linehaulservice-api/v1/linehauls/find-by-id",
        {
            query:
            {
                id: id,
                ownerId: context.params.ownerId ?? context.user?.organizationId
            }
        });
        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Saves the load event
     * @returns 202 OK
     */
    public "POST /v2/linehauls/load-collo" = async (context: AppContext) =>
    {
        await context.authorize();

        const body = context.request.body;

        const orderResult = await context.fetch(
            "POST /v2/orders/list",
            { body: { barcodes: [body.collo.barcode] } }
        );

        if (orderResult.body.orders.lenght <= 0)
        {
            context.response.status = 404;

            return;
        }

        const shipment = orderResult.body.orders[0];

        // FIXME: We can fetch for different orgs. But we assign the current one as owner???
        body.shipment =
        {
            "id": shipment.publicId,
            "ownerId": context.user?.organizationId
        };

        await this.apiClient.post("linehaulservice-api/v1/linehauls/load-collo",
        {
            body: body
        });

        context.response.body =
        {
            "shipment": body.shipment,
            "barcode": body.collo.barcode,
            "load": {
                "handleMethod": body.handleMethod,
                "location": body.location
            }
        };

        context.response.status = 200;
    }

    /**
     * Saves the unload event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/unload" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/unload",
        {
            body:
            {
                ...context.request.body,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }

    /**
     * Saves the damaged event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/damaged" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/damaged",
        {
            body:
            {
                ...context.request.body,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }

    /**
     * Saves the missing event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/missing" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/missing",
        {
            body:
            {
                ...context.request.body,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }

    /**
     * Saves the removed event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/remove" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/remove",
        {
            body:
            {
                ...context.request.body,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }
}
