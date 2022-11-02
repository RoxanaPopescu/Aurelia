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
     * Finds best-fit linehauls with this current barcode
     * @returns The linehauls found with this barcode.
     */
    public "GET /v2/linehauls/find-by-barcode" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get("linehaulservice-api/v1/linehauls/find-by-barcode",
        {
            query: context.params
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
        const ownerId = context.params.ownerId ?? context.user?.organizationId;

        await this.apiClient.post("linehaulservice-api/v1/linehauls/create",
        {
            body:
            {
                id: id
            }
        });

        context.response.body =
        {
            id: id,
            ownerId: ownerId,
            colli: []
        };

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
            { body: { barcodes: [body.collo.barcode], status: [3] } }
        );

        if (orderResult.body.orders.lenght <= 0)
        {
            context.response.status = 404;

            return;
        }

        const shipment = orderResult.body.orders[0];

        body.shipment =
        {
            "id": shipment.publicId,
            "ownerId": shipment.consignorId
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
    public "POST /v2/linehauls/unload-collo" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("linehaulservice-api/v1/linehauls/unload-collo",
        {
            body: context.request.body
        });

        context.response.status = 204;
    }

    /**
     * Saves the damaged event at unload
     * @returns 204 ok
     */
    public "POST /v2/linehauls/collo-damaged-at-unload" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("linehaulservice-api/v1/linehauls/collo-damaged-at-unload",
        {
            body: context.request.body
        });

        context.response.status = 204;
    }

    /**
     * Saves the missing event at unload
     * @returns 204 ok
     */
    public "POST /v2/linehauls/collo-missing-at-unload" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("linehaulservice-api/v1/linehauls/collo-missing-at-unload",
        {
            body: context.request.body
        });

        context.response.status = 204;
    }

    /**
     * Saves the removed event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/remove-collo" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("linehaulservice-api/v1/linehauls/remove-collo",
        {
            body: context.request.body
        });

        context.response.status = 204;
    }
}
