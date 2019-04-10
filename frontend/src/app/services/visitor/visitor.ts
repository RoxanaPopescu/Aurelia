import { autoinject } from "aurelia-framework";
import { Cookies } from "shared/infrastructure";
import { Id } from "shared/utilities";
import { DateTime } from "luxon";

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
        let visitorId = cookies.get("visitor");

        if (!visitorId)
        {
            visitorId = Id.uuid(1);

            cookies.set("visitor", visitorId,
            {
                expires: DateTime.utc().plus({ years: 10 })
            });
        }

        this.visitorId = visitorId;

        this.sessionId = Id.uuid(1);
    }

    /**
     * The ID persisted in the browser used by the visitor.
     */
    public readonly visitorId: string;

    /**
     * The ID assigned to the current app session.
     */
    public readonly sessionId: string;
}
