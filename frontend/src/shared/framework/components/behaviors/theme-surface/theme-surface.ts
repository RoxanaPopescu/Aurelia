import { autoinject } from "aurelia-framework";

/**
 * Custom attribute used to specify the theme surface that should be applied to the element.
 */
@autoinject
export class ThemeSurfaceCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which the attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;

    /**
     * Called by the framework when the attribute value changes.
     * @param newValue The new attribute value.
     */
    protected valueChanged(newValue: string): void
    {
        if (newValue)
        {
            this._element.setAttribute("theme-surface", newValue);
        }
        else
        {
            this._element.removeAttribute("theme-surface");
        }
    }
}
