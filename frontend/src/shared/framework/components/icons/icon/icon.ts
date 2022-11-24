import { autoinject, bindable } from "aurelia-framework";
import { resolveIconId } from "resources/icons";

/**
 * Custom element that renders the icon with the specified name.
 */
@autoinject
export class IconCustomElement
{
    /**
     * The name identifying the icon to render, or undefined to render no icon.
     */
    @bindable
    public name: string | undefined;

    /**
     * The ID of the icon to render, or undefined to render no icon.
     */
    protected id: string | undefined;

    /**
     * Called by the framework when the `name` property changes.
     * Resolves the ID of the icon to render.
     */
    protected nameChanged(): void
    {
        this.id = this.name != null ? resolveIconId(this.name) :  undefined;
    }
}
