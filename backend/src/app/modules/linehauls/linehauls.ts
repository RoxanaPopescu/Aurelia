import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to linehauls.
 */
export class LinehaulsModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Starts loading with the specified id - if it does not exist it will be created
         * @param context.params.id The ID of the linehaul to get.
         * @returns The linehaul with the specified reference.
         * @returns 400 if not found.
         */
        this.router.get("/v2/linehauls/load/:reference", async context =>
        {
            await context.authorize();

            try
            {
                const result = await this.apiClient.post("linehauls/details",
                {
                    body:
                    {
                        reference: context.params.reference,
                        outfitId: context.user?.organizationId,
                        actionById: context.user?.id
                    }
                });

                context.response.body = result.data;
                context.response.status = 200;
            }
            catch (error)
            {
                if (error.response.status === 400 || error.response.status === 404)
                {
                    const result = await this.apiClient.post("linehauls/create",
                    {
                        body:
                        {
                            reference: context.params.reference,
                            ownerId: context.user?.organizationId,
                            actionById: context.user?.id
                        }
                    });

                    context.internal();

                    const detailsResult = await this.apiClient.post("linehauls/details",
                    {
                        body:
                        {
                            id: result.data.id,
                            outfitId: context.user?.organizationId,
                            actionById: context.user?.id
                        }
                    });

                    context.response.body = detailsResult.data;
                    context.response.status = 200;
                }
                else
                {
                    throw error;
                }
            }
        });

        /**
         * Starts unloading with the specified
         * @param context.params.id The ID of the linehaul to get.
         * @returns The linehaul with the specified reference.
         * @returns 400 if not found.
         */
        this.router.get("/v2/linehauls/unload/:reference", async context =>
        {
            await context.authorize();

            const result = await this.apiClient.post("linehauls/details",
            {
                body:
                {
                    reference: context.params.reference,
                    outfitId: context.user?.organizationId,
                    actionById: context.user?.id
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Finalise the linehaul
         * @param context.params.id The ID of the linehaul to get.
         * @returns The linehaul with the specified reference.
         */
        this.router.get("/v2/linehauls/unload-finalize/:id", async context =>
        {
            await context.authorize();

            const result = await this.apiClient.post("linehauls/unloadFinalize",
            {
                body:
                {
                    id: context.params.id,
                    outfitId: context.user?.organizationId,
                    actionById: context.user?.id
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Saves the load event
         * @returns 202 ok
         */
        this.router.post("/v2/linehauls/collo/load", async context =>
        {
            await context.authorize();

            const routesResult = await this.apiClient.post("linehauls/collo/load",
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
        });

        /**
         * Saves the unload event
         * @returns 202 ok
         */
        this.router.post("/v2/linehauls/collo/unload", async context =>
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
        });

        /**
         * Saves the damaged event
         * @returns 202 ok
         */
        this.router.post("/v2/linehauls/collo/damaged", async context =>
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
        });

        /**
         * Saves the missing event
         * @returns 202 ok
         */
        this.router.post("/v2/linehauls/collo/missing", async context =>
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
        });

        /**
         * Saves the removed event
         * @returns 202 ok
         */
        this.router.post("/v2/linehauls/collo/remove", async context =>
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
        });
    }
}
