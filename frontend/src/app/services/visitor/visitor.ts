import { DateTime } from "luxon";
import { autoinject } from "aurelia-framework";
import { Id } from "shared/utilities";
import { Cookies } from "shared/infrastructure";
import settings from "resources/settings";

/**
 * Represents info about the visitor that loaded the app.
 */
@autoinject
export class Visitor
{
    /**
     * Creates a new instance of the type.
     * @param cookies The `Cookies` instance.
     */
    public constructor(cookies: Cookies)
    {
        // Get or generate the visitor ID.

        this.visitorId = cookies.get("visitor") ?? Id.uuid(1);

        cookies.set("visitor", this.visitorId,
        {
            expires: DateTime.utc().plus({ years: 10 })
        });

        settings.infrastructure.api.defaults!.headers!["x-visitor"] = this.visitorId;

        // Get or generate the session ID.

        this.sessionId = sessionStorage.getItem("session") ?? Id.uuid(1);;

        sessionStorage.setItem("session", this.sessionId);

        settings.infrastructure.api.defaults!.headers!["x-session"] = this.sessionId;

        // Get or generate the instance ID.

        this.instanceId = Id.uuid(1);

        settings.infrastructure.api.defaults!.headers!["x-instance"] = this.instanceId;
    }

    /**
     * The ID persisted in the browser used by the visitor.
     */
    public readonly visitorId: string;

    /**
     * The ID assigned to the current browser session.
     */
    public readonly sessionId: string;

    /**
     * The ID assigned to the current app instance.
     */
    public readonly instanceId: string;
}
