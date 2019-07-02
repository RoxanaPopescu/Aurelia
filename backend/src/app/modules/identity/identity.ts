import bcrypt from "bcrypt";
import { ParameterizedContext } from "koa";
import settings from "../../../resources/settings/settings";
import { AuthenticationError } from "../../../shared/types";
import { AppModule } from "../../app-module";
import { identityService } from "./services/identity";

/**
 * Represents a module exposing endpoints related to identity.
 */
export class IdentityModule extends AppModule
{
    public configure(): void
    {
        /**
         * Authenticates the user using a username and password.
         * @param body.username The username for the user.
         * @param body.password The password for the user.
         * @param body.remember True to return persistent token cookies.
         * @returns 200: The authenticated user.
         */
        this.router.post("/identity/authenticate", async context =>
        {
            // Get the username and password from the request.
            const username = context.request.body.username as string | undefined;
            const password = context.request.body.password as string | undefined;

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

            // Create and set the refresh token.
            const refreshJwt = await identityService.createRefreshToken(identity);
            this.setRefreshTokenCookie(context, refreshJwt);

            // Create and set the access token.
            const accessJwt = await identityService.createAccessToken(identity);
            this.setAccessTokenCookie(context, accessJwt);

            // Return the identity.
            context.body = identity;
            context.status = 200;
        });

        /**
         * Authenticates the user using the refresh token cookie.
         * @returns 200: The authenticated user.
         */
        this.router.post("/identity/reauthenticate", async context =>
        {
            // Get the username from the request.
            const refreshJwt = context.cookies.get("refreshToken");

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

            // Return the identity.
            context.body = identity;
            context.status = 200;
        });

        /**
         * Deauthenticates the user identified by the JWT token in the request.
         * @returns 204
         */
        this.router.post("/identity/deauthenticate", async context =>
        {
            // TODO: Should we also revoke the refresh token?

            // Clear the tokens.
            this.setRefreshTokenCookie(context, undefined);
            this.setAccessTokenCookie(context, undefined);

            // Return nothing.
            context.status = 204;
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

        context.cookies.set("access-token", accessJwt,
        {
            ...settings.infrastructure.cookies,
            maxAge
        });

        // TODO: Maybe we should have a separate permission cookie, and then the access token should just contain a hash of that?
        // That way, the access token can be httpOnly, while the client can still read the permissions.
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

        context.cookies.set("refresh-token", refreshJwt,
        {
            ...settings.infrastructure.cookies,
            httpOnly: true,
            maxAge
        });
    }
}
