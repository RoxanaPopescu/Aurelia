import { Profile } from "shared/src/model/profile";
import njwt from "njwt";

/**
 * Gets the claims for the currently authenticated user.
 * @returns The claims for the currently authenticated user.
 */
export function getUserClaims(): string[]
{
    if (Profile.tokens == null)
    {
        throw new Error("Cannot get claims when the user is not authenticated.");
    }

    let parsedBody: any;

    try
    {
        const jwt = njwt.verify(Profile.tokens.access);

        parsedBody = jwt.parsedBody;
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
        .filter(claim => parsedBody[claim] === "true")
        .map(claim => claim.toLowerCase().replace(/\s/g, "-"));
}
