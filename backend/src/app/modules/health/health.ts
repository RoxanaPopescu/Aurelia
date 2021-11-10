import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to health checks.
 */
export class HealthModule extends AppModule
{
    /**
     * Gets the current health status.
     */
    public "GET /health" = (context: AppContext) =>
    {
        context.response.body = "OK";
        context.response.status = 200;
    }

    /**
     * Gets the current health status.
     */
    public "GET /v2/health" = (context: AppContext) =>
    {
        context.response.body = "OK";
        context.response.status = 200;
    }
}
