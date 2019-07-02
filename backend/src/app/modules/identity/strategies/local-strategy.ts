import koaPassport from "koa-passport";
import { Strategy } from "passport-local";
import { identityService } from "../services/identity";

koaPassport.use(new Strategy(
    {
        usernameField: "username",
        passwordField: "password"
    },
    async (username, password, done) =>
    {
        try
        {
            // Try to get the user.
            const user = await identityService.findByUsername(username);

            // Verify that the user exists, and that the password matches.
            if (user != null && password === user.password)
            {
                done(null, user);
            }
            else
            {
                done(null, false);
            }
        }
        catch (error)
        {
            done(error);
        }
    })
);
