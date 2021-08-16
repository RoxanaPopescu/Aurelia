import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import { ApiError, ApiResult } from "../../../shared/infrastructure";
import { Base64 } from "../../../shared/utilities";
import { AppModule } from "../../app-module";
import settings from "../../../resources/settings/settings";

/**
 * Represents a module exposing endpoints related to authentication and authorization.
 */
export class IdentityModule extends AppModule
{
    public configure(): void
    {
        /**
         * Authenticates the user, based on the specified email and password.
         * @param body.email The email address identifying the user.
         * @param body.password The users password.
         * @returns
         * - 200: A refresh token and an access token that grants permission to create or choose an organization.
         */
        this.router.post("/v2/identity/authenticate", async context =>
        {
            try
            {
                const result = await this.apiClient.post("identity/connect/token",
                {
                    headers:
                    {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    body:
                        // tslint:disable: quotemark
                        `client_id=bff&` +
                        `client_secret=${encodeURIComponent(settings.app.oAuth.clientSecret)}&` +
                        `scope=openid profile email organization-selection offline_access&` +
                        `grant_type=password&` +
                        `username=${encodeURIComponent(context.request.body.email)}&` +
                        `password=${encodeURIComponent(context.request.body.password)}`
                        // tslint:enable
                });

                context.response.body = await this.getAuthResponse(result);
                context.response.status = 200;

            }
            catch (error)
            {
                if (error instanceof ApiError && error.data.error === "invalid_grant")
                {
                    context.response.status = 401;
                }
                else
                {
                    throw error;
                }
            }
        });

        /**
         * Authorizes the user, based on the specified access token and organization.
         * @param body.organizationId The ID of the organization for which to get an access token, if any.
         * @returns
         * - 200: A refresh token and an access token that grants permission to create or choose an organization,
         *   and additional permissions within the specified organization.
         */
        this.router.post("/v2/identity/authorize", async context =>
        {
            await context.authorize();

            try
            {
                const result = await this.apiClient.post("identity/selectorganization",
                {
                    body:
                    {
                        organizationId: context.request.body.organizationId
                    }
                });

                context.response.body = await this.getAuthResponse(result);
                context.response.status = 200;
            }
            catch (error)
            {
                if (error instanceof ApiError && error.response?.status === 403)
                {
                    context.response.status = 401;
                }
                else
                {
                    throw error;
                }
            }
        });

        /**
         * Reauthorizes the user, based on the specified refresh token, and optionbally, access token.
         * @param body.refreshToken The refresh token for which to get an access token.
         * @returns
         * - 200: A refresh token and an access token that grants permission to create or choose an organization,
         *   and if an access token for an organization was specified, additional permissions within that organization.
         */
        this.router.post("/v2/identity/reauthorize", async context =>
        {
            try
            {
                const result = await this.apiClient.post("identity/connect/token",
                {
                    headers:
                    {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    body:
                        // tslint:disable: quotemark
                        `client_id=bff&` +
                        `client_secret=${encodeURIComponent(settings.app.oAuth.clientSecret)}&` +
                        `grant_type=refresh_token&` +
                        `refresh_token=${encodeURIComponent(context.request.body.refreshToken)}`
                        // tslint:enable
                });

                context.response.body = await this.getAuthResponse(result);
                context.response.status = 200;
            }
            catch (error)
            {
                if (error instanceof ApiError && error.data.error === "invalid_grant")
                {
                    context.response.status = 401;
                }
                else
                {
                    throw error;
                }
            }
        });

        /**
         * Unauthenticates the user, by revoking the specified refresh token.
         * @param body.refreshToken The refresh token to revoke.
         * @returns
         * - 204: No content.
         */
        this.router.post("/v2/identity/unauthenticate", async context =>
        {
            await context.authorize();

            await this.apiClient.post("identity/connect/revocation",
            {
                headers:
                {
                    "content-type": "application/x-www-form-urlencoded",
                    "authorization": Base64.encode(`bff:${settings.app.oAuth.clientSecret}`)
                },
                body:
                    // tslint:disable: quotemark
                    `token=${encodeURIComponent(context.request.body.refreshToken)}&` +
                    `token_type_hint=refresh_token`
                    // tslint:enable
            });

            context.response.status = 204;
        });
    }

    // tslint:disable: member-ordering

    private readonly _verifyOptions: jwt.VerifyOptions =
    {
        issuer: settings.middleware.authorize.accessToken.issuer
    };

    private readonly _jwksRsaClient = jwksRsa(
    {
        jwksUri: settings.app.oAuth.jwksUri
    });

    private readonly _getKeyFunc = (header: any, callback: any) =>
    {
        this._jwksRsaClient.getSigningKey(header.kid, (error: any, key: any) =>
            callback(error, key?.publicKey || key?.rsaPublicKey));
    }

    // tslint:enable

    private async getAuthResponse(authResult: ApiResult): Promise<any>
    {
        const jwtObject = await new Promise<any>((resolve, reject) =>
        {
            jwt.verify(authResult.data.access_token, this._getKeyFunc, this._verifyOptions, (error, decoded) =>
                error ? reject(error) : resolve(decoded));
        });

        const [result1, result2] = await Promise.all(
        [
            this.apiClient.get("identity/connect/userinfo",
            {
                headers:
                {
                    "authorization": `Bearer ${authResult.data.access_token}`
                }
            }),
            jwtObject.organization == null ? undefined : this.apiClient.get("organizations/GetOrganization",
            {
                headers:
                {
                    "authorization": `Bearer ${authResult.data.access_token}`
                },
                query:
                {
                    id: jwtObject.organization
                }
            })
        ]);

        return {
            accessToken: authResult.data.access_token ?? authResult.data.accessToken,
            refreshToken: authResult.data.refresh_token ?? authResult.data.refreshToken,
            id: result1.data.id,
            username: result1.data.email,
            fullName: result1.data.name,
            preferredName: result1.data.preferred_username,
            pictureUrl: result1.data.picture,
            outfit: result2 == null ? undefined :
            {
                id: result2.data.organizationId,
                companyName: result2.data.name
            }
        };
    }
}
