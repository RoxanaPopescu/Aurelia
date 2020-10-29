import { autoinject } from "aurelia-framework";
import { setPrerenderStatusCode } from "shared/infrastructure";

/**
 * Represents the module.
 */
@autoinject
export class UnknownModule
{
    /**
     * Called by the framework when the page is activating.
     */
    public activate(): void
    {
        // Set the status code that should be returned to crawlers.
        setPrerenderStatusCode(404);
    }
}
