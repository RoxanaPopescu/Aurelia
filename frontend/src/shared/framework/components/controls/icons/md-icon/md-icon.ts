import { autoinject, bindable } from "aurelia-framework";

// Load the icon font.
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
link.rel = "stylesheet";
document.head.appendChild(link);

/**
 * Custom element that renders the icon with the specified name.
 */
@autoinject
export class MdIconCustomElement
{
    /**
     * The name of the icon to render.
     * See: https://material.io/tools/icons
     */
    @bindable
    public name?: string;
}
