import bcrypt from "bcrypt";
import { ParameterizedContext } from "koa";
import { AuthenticationError } from "../../../shared/types";
import { AppModule } from "../../app-module";
import { identityService } from "./services/identity";
import settings from "../../../resources/settings/settings";

/**
 * Represents a module exposing endpoints related to identity.
 */
export class IdentityModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Authenticates the user using a username and password.
         * @param body.username The username for the user.
         * @param body.password The password for the user.
         * @param body.remember True to return persistent token cookies.
         * @returns 204: No content.
         */
        this.router.post("/v2/identity/authenticate", async context =>
        {
            // Try to get the username and password from the request.
            const username = context.request.body.username as string | undefined;
            const password = context.request.body.password as string | undefined;
            const remember = context.request.body.remember as boolean | undefined;

            // Verify that a username and password was provided.
            if (!username || !password)
            {
                throw new AuthenticationError("Missing username or password.");
            }

            // Try to get the identity.
            const identity = await identityService.findByUsername(username);

            // Verify that the identity was found.
            if (identity == null)
            {
                throw new AuthenticationError("Invalid username.");
            }

            // Verify that the password is correct.
            if (!bcrypt.compareSync(password, identity.password))
            {
                throw new AuthenticationError("Invalid password.");
            }

            // Should we return a refresh token?
            if (remember)
            {
                // Create and set the refresh token.
                const refreshJwt = await identityService.createRefreshToken(identity);
                this.setRefreshTokenCookie(context, refreshJwt);
            }
            else
            {
                this.setRefreshTokenCookie(context, undefined);
            }

            // Create and set the access token.
            const accessJwt = await identityService.createAccessToken(identity);
            this.setAccessTokenCookie(context, accessJwt);

            // Return nothing.
            context.status = 204;
        });

        /**
         * Authenticates the user using the refresh token cookie.
         * @returns 204: No content.
         */
        this.router.post("/v2/identity/reauthenticate", async context =>
        {
            // Try to get the refresh token from the request.
            const refreshJwt = this.getRefreshTokenCookie(context);

            // Verify that a refresh token was provided.
            if (!refreshJwt)
            {
                throw new AuthenticationError("Missing refresh token.");
            }

            // Try to parse the refresh token.
            const refreshToken = await identityService.parseRefreshToken(refreshJwt);

            // Verify that the refresh token was parsed successfully.
            if (refreshToken == null)
            {
                throw new AuthenticationError("Invalid refresh token.");
            }

            // Try to get the identity.
            const identity = await identityService.findByUserId(refreshToken.userId);

            // Verify that the identity was found.
            if (identity == null)
            {
                throw new AuthenticationError("User no longer exists.");
            }

            // Create and set the access token.
            const accessJwt = await identityService.createAccessToken(identity);
            this.setAccessTokenCookie(context, accessJwt);

            // Return nothing.
            context.status = 204;
        });

        /**
         * Deauthenticates the user identified by the JWT token in the request.
         * @returns 204: No content.
         */
        this.router.post("/v2/identity/deauthenticate", async context =>
        {
            // Try to get the refresh token from the request.
            const refreshJwt = this.getRefreshTokenCookie(context);

            // If a refresh token was provided, revoke it.
            if (refreshJwt)
            {
                await identityService.revokeRefreshToken(refreshJwt);
            }

            // Clear the tokens.
            this.setRefreshTokenCookie(context, undefined);
            this.setAccessTokenCookie(context, undefined);

            // Return nothing.
            context.status = 204;
        });
    }

    /**
     * Gets the value of the cookie containing the refresh token.
     * @param context The context for which the cookie should be set.
     * @returns The refresh token, or undefined it not provided.
     */
    private getRefreshTokenCookie(context: ParameterizedContext): string | undefined
    {
        return context.cookies.get(settings.middleware.identity.refreshToken.cookie);
    }

    /**
     * Sets the cookie containing the refresh token.
     * @param context The context for which the cookie should be set.
     * @param refreshJwt The refresh token, or undefined to clear the cookie.
     */
    private setRefreshTokenCookie(context: ParameterizedContext, refreshJwt: string | undefined): void
    {
        const maxAge = refreshJwt && context.request.body.remember
            ? settings.middleware.identity.refreshToken.expiresIn.as("milliseconds")
            : undefined;

        context.cookies.set(settings.middleware.identity.refreshToken.cookie, refreshJwt || "",
        {
            ...settings.infrastructure.cookies,
            httpOnly: true,
            maxAge
        });
    }

    /**
     * Sets the cookie containing the access token.
     * @param context The context for which the cookie should be set.
     * @param accessJwt The access token, or undefined to clear the cookie.
     */
    private setAccessTokenCookie(context: ParameterizedContext, accessJwt: string | undefined): void
    {
        const maxAge = accessJwt && context.request.body.remember
            ? settings.middleware.identity.accessToken.expiresIn.as("milliseconds")
            : undefined;

        context.cookies.set(settings.middleware.identity.accessToken.cookie, accessJwt || "",
        {
            ...settings.infrastructure.cookies,
            maxAge
        });
    }
}
