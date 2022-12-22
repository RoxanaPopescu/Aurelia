import { autoinject, bindable } from "aurelia-framework";
import { AccentColor } from "resources/styles";

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
     * The accent color to use for the edge of the card, an object representing
     * accent colors mapped to the percentage of the edge for which they should be used,
     * or undefined to show no edge.
     */
    @bindable
    public accent: AccentColor | Partial<{ [color in AccentColor]: number }> | undefined;

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

    /**
     * True if the card is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;
}
