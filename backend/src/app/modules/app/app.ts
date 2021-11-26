import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class AppsModule extends AppModule
{
    /**
     * Receives statistics from the app and can tell the app is it's outdated
     * @returns 200 OK or 426 if the app is outdated.
     */
    public "POST /v2/app/session-start" = async (context: AppContext) =>
    {
        const data = context.request.body;
        const minimumVersions =
        {
            "distribution-center": "1.14.0",
            "driver": "2.23.0",
            "collection-point": "1.0.0"
        }

        const version = data.version;
        const minimumVersion = minimumVersions[data.type];

        if (minimumVersion.localeCompare(version, undefined, { numeric: true, sensitivity: 'base' }))
        {
            context.response.status = 426;
        }
        else
        {
            context.response.status = 200;
        }
    }
}
