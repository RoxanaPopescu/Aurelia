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

    const claims = Object.keys(parsedBody).filter(claim => parsedBody[claim] === "true");

    // HACK: Add claims currently missing in the backend.
    claims.push(
        "Create Agreement",
        "View Communication",
        "Edit Communication",
        "View Order Groups",
        "Create Order Group",
        "Edit Order Group",
        "View Route Templates",
        "Create Route Template",
        "Edit Route Template",
        "View Routeplan Simulation",
        "Create Routeplan Simulation",
    );

    return claims.map(claim => claim.toLowerCase().replace(/\s/g, "-"));
}
