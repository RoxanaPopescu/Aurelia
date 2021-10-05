import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class LocationsModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets addresses dependent on a query
         * @returns A list of address objects
         */
        this.router.post("/v2/locations/address-auto-complete", async context =>
        {
            const result = await this.apiClient.get("supporting/locations/addressautocomplete",
            {
                query: {
                    query: context.request.body.query,
                    maxResults: 10
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Returns a single address dependent on id and provider with GPS position
         * @returns A single address with gps location
         */
        this.router.post("/v2/locations/address", async context =>
        {
            const result = await this.apiClient.post("supporting/locations/getaddress",
            {
                body: context.request.body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
