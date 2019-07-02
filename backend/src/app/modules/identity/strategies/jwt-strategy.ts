import koaPassport from "koa-passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { identityService } from "../services/identity";

function cookieExtractor(req: any): any
{
    if (req && req.cookies)
    {
        // tslint:disable-next-line: no-string-literal
        return req.cookies["jwt"];
    }

    return undefined;
}

const options: StrategyOptions =
{
    jwtFromRequest: ExtractJwt.fromExtractors(
    [
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("jwt")
    ]),
    secretOrKey: "pkGuZe4r7QWcWxah9Y7VGb4z8cVKWFM7",
    issuer: "lingu.io",
    audience: "lingu.io"
};

koaPassport.use(new Strategy(options,
    async (payload, done) =>
    {
        try
        {
            // Try to get the user.
            const user = await identityService.findByUsername(payload.username);

            // Verify that the user exists.
            if (user == null)
            {
                throw new Error("Could not find a user with the specified username.");
            }

            done(null, user);
        }
        catch (error)
        {
            done(error);
        }
    })
);
