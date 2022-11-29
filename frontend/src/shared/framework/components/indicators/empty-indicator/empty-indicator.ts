import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents the indicator to be shown if a view is empty.
 */
@autoinject
export class EmptyIndicatorCustomElement
{
    /**
     * The size of the indicator.
     */
    @bindable({ defaultValue: "large" })
    public size: "small" | "medium" | "large";

    /**
     * The name of the icon, or undefined to show no icon.
     */
    @bindable({ defaultValue: "ico-empty-box" })
    public icon: string | undefined;
}
