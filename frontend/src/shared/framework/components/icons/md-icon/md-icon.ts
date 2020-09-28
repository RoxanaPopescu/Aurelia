import { autoinject, bindable } from "aurelia-framework";

// True if the icon font has been loaded, otherwise false.
let loaded = false;

/**
 * Custom element that renders the icon with the specified name.
 */
@autoinject
export class MdIconCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor()
    {
        if (!loaded)
        {
            // Load the icon font.
            const link = document.createElement("link");
            link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
            link.rel = "stylesheet";
            document.head.appendChild(link);

            // Indicate that the icon font has been loaded.
            loaded = true;
        }
    }

    /**
     * The name of the icon to render.
     * See: https://material.io/tools/icons
     */
    @bindable
    public name?: string;
}
