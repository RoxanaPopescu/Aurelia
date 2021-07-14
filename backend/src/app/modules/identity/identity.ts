import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to authentication and authorization.
 */
export class IdentityModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the supported OAuth identity providers, including their sign-in URLs.
         * @param body.clientId The ID of the client making the request.
         * @param body.redirectUri The URI to redirect to when authentication succeeds.
         * @returns
         * 200: The specified OAuth identity providers, including their sign-in URLs.
         */
        this.router.get("/v1/identity/providers", async context =>
        {
            const result = await this.apiClient.post("identity/providers",
            {
                query:
                {
                    clientId: context.request.body.clientId,
                    redirectUri: context.request.body.redirectUri
                }
            });

            context.response.body = result.data.map((provider: any) =>
            ({
                id: provider.id,
                name: provider.name,
                url: provider.url
            }));

            context.response.status = 200;
        });

        /**
         * Gets the specified OAuth identity provider, including its sign-in URL.
         * @param params.providerId The ID of the provider to get.
         * @param body.clientId The ID of the client making the request.
         * @param body.redirectUri The URI to redirect to when authentication succeeds.
         * @returns
         * 200: The specified OAuth identity provider, including its sign-in URL.
         */
        this.router.get("/v1/identity/providers/:providerId", async context =>
        {
            const result = await this.apiClient.get(`identity/providers/${context.params.providerId}`,
            {
                query:
                {
                    clientId: context.request.body.clientId,
                    redirectUri: context.request.body.redirectUri
                }
            });

            context.response.body =
            {
                id: result.data.id,
                name: result.data.name,
                url: result.data.url
            };

            context.response.status = 200;
        });

        /**
         * Authenticates the user, based the specified OAuth identity provider and code.
         * @param params.providerId The ID of the provider to use.
         * @param body.clientId The ID of the client making the request.
         * @param body.redirectUri The redirect URI specified when authenticating with the provider.
         * @returns
         * 200: A refresh token and an access token that grants permission to choose an organization.
         */
        this.router.post("/v1/identity/providers/:providerId/authenticate", async context =>
        {
            const result = await this.apiClient.post(`identity/providers/${context.params.providerId}/authenticate`,
            {
                body:
                {
                    clientId: context.request.body.clientId,
                    redirectUri: context.request.body.redirectUri,
                    code: context.request.body.code
                }
            });

            context.response.body =
            {
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken
            };

            context.response.status = 200;
        });

        /**
         * Authenticates the user, based on the specified email and password.
         * @param body.email The email identifying the user.
         * @param body.password The users password.
         * @returns
         * 200: A refresh token and an access token that grants permission to choose an organization.
         */
        this.router.post("/v1/identity/authenticate", async context =>
        {
            const result = await this.apiClient.post("identity/authenticate",
            {
                body:
                {
                    email: context.request.body.email,
                    password: context.request.body.password
                }
            });

            context.response.body =
            {
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken
            };

            context.response.status = 200;
        });

        /**
         * Authorizes the user, based on the specified refresh token and, optionally organization.
         * @param body.refreshToken The refresh token for which to get an access token.
         * @param body.organizationId The ID of the organization for which to get an access token, if any.
         * @returns
         * 200: A refresh token and an access token that grants permission to choose an organization,
         * and if an organization was specified, additional permissions within that organization.
         */
        this.router.post("/v1/identity/authorize", async context =>
        {
            const result = await this.apiClient.post("identity/authorize",
            {
                body:
                {
                    // accessToken: context.request.headers["authorization"].replace(/^Bearer /, ""), // Not needed, as we forward this header
                    refreshToken: context.request.body.refreshToken,
                    organizationId: context.request.body.organizationId
                }
            });

            context.response.body =
            {
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken
            };

            context.response.status = 200;
        });

        /**
         * Unauthenticates the user, by revoking the specified refresh token.
         * @param body.refreshToken The refresh token to revoke.
         * @returns
         * 204: No content.
         */
        this.router.post("/v1/identity/unauthenticate", async context =>
        {
            context.authorize();

            await this.apiClient.post("identity/unauthenticate",
            {
                body:
                {
                    // accessToken: context.request.headers["authorization"].replace(/^Bearer /, ""), // Not needed, as we forward this header
                    refreshToken: context.request.body.refreshToken
                }
            });

            context.response.status = 204;
        });
    }
}
