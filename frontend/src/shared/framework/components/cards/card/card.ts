import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a card presenting content, which may be used either
 * independently or in a collection layout, such as a grid or list.
 */
@autoinject
export class CardCustomElement
{
    /**
     * The URL to navigate to when the card is clicked,
     * or undefined to do nothing.
     */
    @bindable
    public href: string | undefined;

    /**
     * The browsing context in which the URL should load.
     */
    @bindable({ defaultValue: "_self" })
    public target: "_blank" | "_parent" | "_self" | "_top";

    /**
     * True if the card is active, otherwise false.
     */
    @bindable({ defaultValue: false })
    public active: boolean;
}
