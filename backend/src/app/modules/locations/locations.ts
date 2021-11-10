import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class LocationsModule extends AppModule
{
    /**
     * Gets addresses dependent on a query
     * @returns A list of address objects
     */
    public "POST /v2/locations/address-auto-complete" = async (context: AppContext) =>
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
    }

    /**
     * Returns a single address dependent on id and provider with GPS position
     * @returns A single address with gps location
     */
    public "POST /v2/locations/address" = async (context: AppContext) =>
    {
        const result = await this.apiClient.post("supporting/locations/getaddress",
        {
            body: context.request.body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }
}
