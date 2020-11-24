import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class CollectionPointModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the collection point by ID.
         * @param context.params.id The ID of the collection point to receive.
         * @returns The collection point of the specified ID.
         */
        this.router.get("/v2/collection-point/details/:id", async context =>
        {
            const loginResult = await this.validateDriverLogin(context);

            const result = await this.apiClient.post("collection-point/details",
            {
                body:
                {
                    id: context.params.id,
                    outfitId: loginResult.outfitId
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Saves the colected order event
         * @returns 200 when the event is received
         */
        this.router.post("/v2/collection-point/order/collected", async context =>
        {
            const loginResult = await this.validateDriverLogin(context);

            const result = await this.apiClient.post("collection-point/order/collected",
            {
                body:
                {
                    ...context.request.body,
                    outfitId: loginResult.outfitId,
                    actionById: this.stringToGuid(loginResult.driver.id)
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Saves the missing order event
         * @returns 200 when the event is received
         */
        this.router.post("/v2/collection-point/order/missing", async context =>
        {
            const loginResult = await this.validateDriverLogin(context);

            const result = await this.apiClient.post("collection-point/order/missing",
            {
                body:
                {
                    ...context.request.body,
                    outfitId: loginResult.outfitId,
                    actionById: this.stringToGuid(loginResult.driver.id)
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Saves the damaged order event
         * @returns 200 when the event is received
         */
        this.router.post("/v2/collection-point/order/damaged", async context =>
        {
            const loginResult = await this.validateDriverLogin(context);

            const result = await this.apiClient.post("collection-point/order/damaged",
            {
                body:
                {
                    ...context.request.body,
                    outfitId: loginResult.outfitId,
                    actionById: this.stringToGuid(loginResult.driver.id)
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Saves the rejected order event
         * @returns 200 when the event is received
         */
        this.router.post("/v2/collection-point/order/rejected", async context =>
        {
            const loginResult = await this.validateDriverLogin(context);

            const result = await this.apiClient.post("collection-point/order/rejected",
            {
                body:
                {
                    ...context.request.body,
                    outfitId: loginResult.outfitId,
                    actionById: this.stringToGuid(loginResult.driver.id)
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Saves the not collected order event
         * @returns 200 when the event is received
         */
        this.router.post("/v2/collection-point/order/not-collected", async context =>
        {
            const loginResult = await this.validateDriverLogin(context);

            const result = await this.apiClient.post("collection-point/order/NotCollected",
            {
                body:
                {
                    ...context.request.body,
                    outfitId: loginResult.outfitId,
                    actionById: this.stringToGuid(loginResult.driver.id)
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }

    /**
     * Validates the current driver login with NOI.
     * @param token The login token of the driver.
     * @returns A promise that will be resolved with the details about the driver if valid login.
     */
    private async validateDriverLogin(context: any): Promise<any>
    {
        const result = await this.apiClient.get("logistics-platform/drivers/details-by-token",
        {
            noi: true,
            query: {
                userToken: context.request.headers["token"]
              },
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
