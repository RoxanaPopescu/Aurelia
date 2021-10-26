import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a card presenting info content.
 */
@autoinject
export class InfoCardCustomElement
{
    /**
     * The heading to show.
     */
    @bindable
    public heading: string;
}
