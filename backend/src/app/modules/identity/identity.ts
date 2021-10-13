import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import { Base64 } from "../../../shared/utilities";
import { ApiError, ApiResult } from "../../../shared/infrastructure";
import settings from "../../../resources/settings/settings";
import { AppModule } from "../../app-module";
import { AppContext } from "../../app-context";

/**
 * Represents a module exposing endpoints related to authentication and authorization.
 */
export class IdentityModule extends AppModule
{
    /**
     * Authenticates the user, based on the specified email and password.
     * @param context.request.body.email The email address identifying the user.
     * @param context.request.body.password The users password.
     * @returns
     * - 200: A refresh token and an access token that grants permission to create or choose an organization.
     */
    public "POST /v2/identity/authenticate" = async (context: AppContext) =>
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
            if (error instanceof ApiError && error.data?.error === "invalid_grant")
            {
                context.response.status = 401;
            }
            else
            {
                throw error;
            }
        }
    }

    /**
     * Authorizes the user, based on the specified access token and organization.
     * @param context.request.body.organizationId The ID of the organization for which to get an access token, if any.
     * @returns
     * - 200: A refresh token and an access token that grants permission to create or choose an organization,
     *   and additional permissions within the specified organization.
     */
    public "POST /v2/identity/authorize" = async (context: AppContext) =>
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
    }

    /**
     * Reauthorizes the user, based on the specified refresh token, and optionbally, access token.
     * @param context.request.body.refreshToken The refresh token for which to get an access token.
     * @returns
     * - 200: A refresh token and an access token that grants permission to create or choose an organization,
     *   and if an access token for an organization was specified, additional permissions within that organization.
     */
    public "POST /v2/identity/reauthorize" = async (context: AppContext) =>
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
            if (error instanceof ApiError && error.data?.error === "invalid_grant")
            {
                context.response.status = 401;
            }
            else
            {
                throw error;
            }
        }
    }

    /**
     * Unauthenticates the user, by revoking the specified refresh token.
     * @param context.request.body.refreshToken The refresh token to revoke.
     * @returns
     * - 204: No content
     */
    public "POST /v2/identity/unauthenticate" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("identity/connect/revocation",
        {
            headers:
            {
                "content-type": "application/x-www-form-urlencoded",
                "authorization": `Basic ${Base64.encode(`bff:${settings.app.oAuth.clientSecret}`)}`
            },
            body:
                // tslint:disable: quotemark
                `token=${encodeURIComponent(context.request.body.refreshToken)}&` +
                `token_type_hint=refresh_token`
                // tslint:enable
        });

        context.response.status = 204;
    }

    // DONE?
    /**
     * Unauthenticates the user, by revoking the specified refresh token.
     * @param context.request.body.refreshToken The refresh token to revoke.
     * @returns
     * - 204: No content
     *   The password matched the currently authenticated user.
     * - 401: Unauthorized
     *   The password did not match the currently authenticated user.
     */
    public "POST /v2/identity/verify-password" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("identity/account/profile/password/verify",
        {
            body:
            {
                password: context.request.body.password
            }
        });

        context.response.status = 204;
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
            jwtObject.organization == null ? undefined : this.apiClient.get(`organization/organizations/${jwtObject.organization}`,
            {
                headers:
                {
                    "authorization": `Bearer ${authResult.data.access_token}`
                }
            })
        ]);

        return {
            accessToken: authResult.data.access_token ?? authResult.data.accessToken,
            refreshToken: authResult.data.refresh_token ?? authResult.data.refreshToken,
            id: result1.data.sub,
            email: result1.data.email,
            emailVerified: result1.data.email_verified,
            fullName: result1.data.name,
            preferredName: result1.data.preferred_username,
            pictureUrl: result1.data.picture,
            organization: result2 == null ? undefined :
            {
                id: result2.data.organization.organizationId,
                companyName: result2.data.organization.name
            }
        };
    }
}
