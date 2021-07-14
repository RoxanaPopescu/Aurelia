import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to account management.
 */
export class AccountModule extends AppModule
{
    public configure(): void
    {
        /**
         * Creates a new user with the specified name, email and password.
         * Note that the new user will initailly be unconfirmed.
         * @param body.fullName The full name of the user.
         * @param body.preferredName The preferred name of the user.
         * @param body.email The email identifying the user.
         * @param body.password The password specified by the user.
         * @returns
         * 204: No content.
         */
        this.router.post("/v1/account/create", async context =>
        {
            await this.apiClient.post("account/create",
            {
                body:
                {
                    fullName: context.request.body.fullName,
                    preferredName: context.request.body.preferredName,
                    email: context.request.body.email,
                    password: context.request.body.password
                }
            });

            context.response.status = 204;
        });

        /**
         * Confirms the creation of a new user, by verifying the specified token.
         * @param body.token The token specified in the confirmation link sent to the new user.
         */
        this.router.post("/v1/account/confirm", async context =>
        {
            const result = await this.apiClient.post("account/confirm",
            {
                body:
                {
                    token: context.request.body.token
                }
            });

            context.response.body =
            {
                refreshToken: result.data.refreshToken,
                accessToken: result.data.accessToken
            };

            context.response.status = 200;
        });

        /**
         * Requests password recovery for the user with the specified email.
         */
        this.router.post("/v1/account/forgot-password", async context =>
        {
            await this.apiClient.post("account/forgot-password",
            {
                body:
                {
                    email: context.request.body.email
                }
            });

            context.response.status = 204;
        });

        /**
         * Changes the password for the current user, or the user identified by the specified token.
         */
        this.router.post("/v1/account/change-password", async context =>
        {
            const result = await this.apiClient.post("account/change-password",
            {
                body:
                {
                    // accessToken: context.request.headers["authorization"].replace(/^Bearer /, ""), // Not needed, as we forward this header
                    token: context.request.body.token,
                    password: context.request.body.password
                }
            });

            context.response.body =
            {
                refreshToken: result.data.refreshToken,
                accessToken: result.data.accessToken
            };

            context.response.status = 200;
        });

        /**
         * Deletes the user with the specified email.
         */
        this.router.post("/v1/account/delete", async context =>
        {
            context.authorize();

            await this.apiClient.post("account/unauthenticate",
            {
                body:
                {
                    // accessToken: context.request.headers["authorization"].replace(/^Bearer /, ""), // Not needed, as we forward this header
                    email: context.request.body.email
                }
            });

            context.response.status = 204;
        });
    }
}
