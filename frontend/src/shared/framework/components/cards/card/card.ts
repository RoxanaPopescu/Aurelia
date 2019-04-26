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
}
