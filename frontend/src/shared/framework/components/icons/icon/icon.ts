import { autoinject, bindable } from "aurelia-framework";

/**
 * Custom element that renders the icon with the specified name.
 */
@autoinject
export class IconCustomElement
{
    /**
     * The name of the icon to render, or undefined to render no icon.
     */
    @bindable
    public name?: string;
}
