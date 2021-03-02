import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to health checks.
 */
export class HealthModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Gets the current health status.
         */
        this.router.get("/health", context =>
        {
            context.response.body = "OK";
            context.response.status = 200;
        });

        /**
         * Gets the current health status.
         */
        this.router.get("/v2/health", context =>
        {
            context.response.body = "OK";
            context.response.status = 200;
        });
    }
}
