import crypto from "crypto";
import jwt from "jsonwebtoken";
import settings from "../../../../../resources/settings/settings";
import { Identity, RefreshToken, AccessToken } from "./identity";

export namespace identityService
{
    const identities =
    [
        new Identity({ id: 1, username: "test", password: "test" })
    ];

    const refreshTokens =
    [
        new RefreshToken({ id: 1, userId: 1 })
    ];

    export async function create(data: any): Promise<Identity>
    {
        const identity = new Identity(data);

        identities.push(identity);

        return identity;
    }

    export async function findByUserId(userId: string): Promise<Identity | undefined>
    {
        return identities.find(i => i.id === userId);
    }

    export async function findByUsername(username: string): Promise<Identity | undefined>
    {
        return identities.find(i => i.username === username);
    }

    export async function createRefreshToken(identity: Identity): Promise<string>
    {
        const createdRefreshToken = new RefreshToken(
        {
            id: crypto.randomBytes(64).toString("hex"),
            userId: identity.id
        });

        const signOptions: jwt.SignOptions =
        {
            expiresIn: settings.middleware.identity.refreshToken.expiresIn.as("seconds"),
            issuer: settings.middleware.identity.refreshToken.issuer,
            audience: settings.middleware.identity.refreshToken.audience
        };

        const refreshJwt = jwt.sign(createdRefreshToken, settings.middleware.identity.refreshToken.secret, signOptions);

        identity.refreshTokens.push(createdRefreshToken);

        return refreshJwt;
    }

    export async function parseRefreshToken(refreshJwt: string): Promise<RefreshToken | undefined>
    {
        const verifyOptions: jwt.VerifyOptions =
        {
            issuer: settings.middleware.identity.refreshToken.issuer,
            audience: settings.middleware.identity.refreshToken.audience
        };

        try
        {
            const data = jwt.verify(refreshJwt, settings.middleware.identity.refreshToken.secret, verifyOptions);
            const parsedRefreshToken = new RefreshToken(data);

            const foundAndValid = refreshTokens.some(t => t.id === parsedRefreshToken.id && !t.revoked);

            if (!foundAndValid)
            {
                return undefined;
            }

            return parsedRefreshToken;
        }
        catch
        {
            return undefined;
        }
    }

    export async function revokeRefreshToken(refreshJwt: string): Promise<void>
    {
        const parsedRefreshToken = await parseRefreshToken(refreshJwt);

        if (parsedRefreshToken != null)
        {
            const storedRefreshToken = refreshTokens.find(t => t.id === parsedRefreshToken.id && !t.revoked);

            if (storedRefreshToken != null)
            {
                storedRefreshToken.revoked = true;
            }
        }
    }

    export async function createAccessToken(identity: Identity): Promise<string>
    {
        const accessToken = new AccessToken(
        {
            username: identity.username,
            permissions: identity.permissions
        });

        const signOptions: jwt.SignOptions =
        {
            expiresIn: settings.middleware.identity.accessToken.expiresIn.as("seconds"),
            issuer: settings.middleware.identity.accessToken.issuer,
            audience: settings.middleware.identity.accessToken.audience
        };

        const accessJwt = jwt.sign(accessToken, settings.middleware.identity.accessToken.secret, signOptions);

        return accessJwt;
    }

    export async function parseAccessToken(accessJwt: string): Promise<AccessToken | undefined>
    {
        const verifyOptions: jwt.VerifyOptions =
        {
            issuer: settings.middleware.identity.accessToken.issuer,
            audience: settings.middleware.identity.accessToken.audience
        };

        try
        {
            const data = jwt.verify(accessJwt, settings.middleware.identity.accessToken.secret, verifyOptions);
            const parsedAccessToken = new AccessToken(data);

            return parsedAccessToken;
        }
        catch
        {
            return undefined;
        }
    }
}
