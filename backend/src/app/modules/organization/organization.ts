import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to organizations.
 */
export class OrganizationModule extends AppModule
{
    public configure(): void
    {
        /**
         * Creates a new organization.
         */
        this.router.post("/v2/organizations/create", async context =>
        {
            const result = await this.apiClient.post("organizations/CreateOrganization",
            {
                body: context.request.body.redirectUrl
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Gets all organizations visible to the current user.
         */
        this.router.post("/v2/organizations", async context =>
        {
            const result = await this.apiClient.get("organizations/TODO");

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Gets the specified organization.
         */
        this.router.post("/v2/organizations/:id", async context =>
        {
            const result = await this.apiClient.get("organizations/GetOrganization",
            {
                query:
                {
                    id: context.params.id
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
