import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class CollectionPointModule extends AppModule
{
    /**
     * Creates a collection point
     * @returns 200 when the collection point is created
     */
    public "POST /v2/collection-points" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "edit-routes");

        const result = await this.apiClient.post("collection-point/collection-points",
        {
            body:
            {
                ...context.request.body,
                createdBy: validationResult.userId
            },
            headers:
            {
                "x-organization": validationResult.outfitId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Searches for collection points.
     * @param get parameters from url.
     * @returns The collection points without orders.
     */
    public "GET /v2/collection-points" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "view-routes");

        const result = await this.apiClient.get("collection-point/collection-points",
        {
            query:
            {
                ...context.query
            },
            headers:
            {
                "x-organization": validationResult.outfitId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Searches for orders within collection points
     * @param get parameters from url.
     * @returns The collection points without orders.
     */
    public "GET /v2/collection-points/:id/orders" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "view-routes");

        const result = await this.apiClient.get(`collection-point/collection-points/${context.params.id}/orders`,
        {
            query:
            {
                ...context.query
            },
            headers:
            {
                "x-organization": validationResult.outfitId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the collection point by ID.
     * @param context.params.id The ID of the collection point to receive.
     * @returns The collection point of the specified ID.
     */
    public "GET /v2/collection-points/:id" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "view-routes");

        const result = await this.apiClient.post("collection-point/details",
        {
            body:
            {
                id: context.params.id,
                outfitId: validationResult.outfitId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Saves the colected order event
     * @returns 200 when the event is received
     */
    public "POST /v2/collection-points/orders/collected" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "edit-routes");

        const result = await this.apiClient.post("collection-point/orders/collected",
        {
            body:
            {
                ...context.request.body,
                outfitId: validationResult.outfitId,
                actionById: validationResult.userId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Saves the missing order event
     * @returns 200 when the event is received
     */
    public "POST /v2/collection-points/orders/missing" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "edit-routes");

        const result = await this.apiClient.post("collection-point/orders/missing",
        {
            body:
            {
                ...context.request.body,
                outfitId: validationResult.outfitId,
                actionById: validationResult.userId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Saves the damaged order event
     * @returns 200 when the event is received
     */
    public "POST /v2/collection-points/orders/damaged" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "edit-routes");

        const result = await this.apiClient.post("collection-point/orders/damaged",
        {
            body:
            {
                ...context.request.body,
                outfitId: validationResult.outfitId,
                actionById: validationResult.userId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Saves the rejected order event
     * @returns 200 when the event is received
     */
    public "POST /v2/collection-points/orders/rejected" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "edit-routes");

        const result = await this.apiClient.post("collection-point/orders/rejected",
        {
            body:
            {
                ...context.request.body,
                outfitId: validationResult.outfitId,
                actionById: validationResult.userId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Saves the not collected order event
     * @returns 200 when the event is received
     */
    public "POST /v2/collection-points/orders/not-collected" = async (context: AppContext) =>
    {
        const validationResult = await this.validateLogin(context, "edit-routes");

        const result = await this.apiClient.post("collection-point/orders/NotCollected",
        {
            body:
            {
                ...context.request.body,
                outfitId: validationResult.outfitId,
                actionById: validationResult.userId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Validates the current driver login with NOI.
     * @param token The login token of the driver.
     * @returns A promise that will be resolved with the details about the driver if valid login.
     */
    private async validateLogin(context: any, permission: string): Promise<{ outfitId: string; userId: string }>
    {
        let outfitId: string;
        let userId: string;

        // Allow legacy token authorization
        const noiOrigin = context.request.headers["x-noi-origin"];
        if (noiOrigin === "true")
        {
            const driver = await this.validateDriverLogin(context);
            outfitId = driver.outfitId;
            userId = this.stringToGuid(driver.id);
        }
        else
        {
            await context.authorize(permission);
            outfitId = context.user.organizationId;
            userId = context.user.id;
        }

        return { outfitId: outfitId, userId: userId };
    }

    /**
     * Validates the current driver login with NOI.
     * @param token The login token of the driver.
     * @returns A promise that will be resolved with the details about the driver if valid login.
     */
    private async validateDriverLogin(context: AppContext): Promise<any>
    {
        const result = await this.apiClient.get("logistics-platform/drivers/validate-login",
        {
            noi: true,
            query:
            {
                "access-token": context.request.headers["token"]
            }
        });

        return result.data;
    }

    /**
     * Returns the driver id as a guid
     * @param id the string of the driver
     * @returns The id of the driver with leading 0's as a GUID
     */
    private stringToGuid(id: string): string
    {
        const totalLength = 12;
        const paddingLength = totalLength - id.length;

        return `00000000-0000-0000-0000-${"0".repeat(paddingLength)}${id}`;
    }
}
