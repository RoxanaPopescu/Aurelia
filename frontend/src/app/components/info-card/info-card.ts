import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a card presenting info content.
 */
@autoinject
export class InfoCardCustomElement
{
    /**
     * The title to show.
     */
    @bindable
    public title: string;
}
