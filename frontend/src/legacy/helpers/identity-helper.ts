import njwt from "njwt";
import { DateTime, Duration } from "luxon";

/**
 * Gets the claims from the specified tokens.
 * @param tokens The tokens encoding the claims.
 * @returns The claims from the specified tokens.
 */
export function getUserClaims(tokens?: { access: string; refresh: string; }): string[]
{
    if (tokens == null)
    {
        throw new Error("Cannot get claims when the user is not authenticated.");
    }

    let parsedBody: any;

    try
    {
        const jwt = njwt.verify(tokens.access);

        if (jwt == null)
        {
            throw new Error("Could not parse the JWT token.");
        }

        parsedBody = jwt?.body.toJSON();
    }
    catch(error)
    {
        if (error.parsedBody == null)
        {
            throw new Error(`Could not parse the JWT token. ${error.message}`);
        }

        parsedBody = error.parsedBody;
    }

    return Object.keys(parsedBody)
        .filter(claim => parsedBody[claim] === "true");
}

/**
 * Gets the claims for the currently authenticated user.
 * @returns The claims for the currently authenticated user.
 */
export function getAccessTokenExpireDuration(accessToken: string): Duration
{
    let exp: number;

    try
    {
        const jwt = njwt.verify(accessToken);

        if (jwt == null)
        {
            throw new Error("Could not parse the JWT token.");
        }

        exp = jwt.body.toJSON().exp as number;
    }
    catch(error)
    {
        if (error.parsedBody == null)
        {
            throw new Error(`Could not parse the JWT token. ${error.message}`);
        }

        exp = error.parsedBody.exp;
    }

    const expireDateTime = DateTime.fromSeconds(exp);
    return expireDateTime.diff(DateTime.local());
}
