import { AppModule } from "../../app-module";
import { environment } from "../../../env";

/**
 * Represents a module exposing endpoints related to depots.
 */
export class EnvModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Gets the current environment.
         */
        this.router.get("/__env", async context =>
        {
            context.response.body = { environment: environment.name };
            context.response.status = 200;
        });
    }
}
