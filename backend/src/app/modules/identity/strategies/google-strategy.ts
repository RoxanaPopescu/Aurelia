import koaPassport from "koa-passport";
import { OAuthStrategy } from "passport-google-oauth";
import { identityService } from "../services/identity";

koaPassport.use(new OAuthStrategy(
    {
        consumerKey: process.env.GOOGLE_CLIENT_ID!,
        consumerSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "https://localhost:8080/api/v1/identity/authenticate/google/callback"
    },
    async (accessToken, refreshToken, profile, done) =>
    {
        try
        {
            // Get or create the user.
            const user =
                //await identityService.findByGoogleId(profile.id) ||
                await identityService.create({ googleId: profile.id });

            done(null, user);
        }
        catch (error)
        {
            done(error);
        }
    })
);
