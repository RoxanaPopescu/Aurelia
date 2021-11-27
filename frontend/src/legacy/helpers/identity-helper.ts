import jwtDecode from "jwt-decode";
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
        parsedBody = jwtDecode<any>(tokens.access);
    }
    catch(error)
    {
        throw new Error(`Could not parse the JWT token. ${error.message}`);
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
        exp = jwtDecode<any>(accessToken).exp;
    }
    catch(error)
    {
        throw new Error(`Could not parse the JWT token. ${error.message}`);
    }

    const expireDateTime = DateTime.fromSeconds(exp);
    return expireDateTime.diff(DateTime.local());
}
