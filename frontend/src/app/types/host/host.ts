import { autoinject } from "aurelia-framework";
import { Cookies } from "shared/infrastructure";

/**
 * Represents info about the host that served the app.
 */
@autoinject
export class Host
{
    /**
     * Creates a new instance of the type.
     * @param cookies The `Cookies` instance.
     */
    public constructor(cookies: Cookies)
    {
        // Get the slug identifying the theme associated with the host, if any.

        this.theme = cookies.get("host-theme");
    }

    /**
     * The slug identifying the theme associated with the host, if any.
     */
    public readonly theme: string | undefined;
}
