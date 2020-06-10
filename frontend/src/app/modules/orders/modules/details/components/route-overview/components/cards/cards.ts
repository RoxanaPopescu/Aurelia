import { autoinject, bindable } from "aurelia-framework";
import { Route } from "app/model/route";

/**
 * Represents the module.
 */
@autoinject
export class Cards
{
    /**
     * The order to present.
     */
    @bindable
    public route: Route | undefined;
}
