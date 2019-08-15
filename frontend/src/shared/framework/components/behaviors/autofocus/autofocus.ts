import { autoinject, bindable } from "aurelia-framework";
import { IExtendedFocusOptions } from "shared/framework/services/focus";

/**
 * Custom attribute that focuses the element to which it is applied.
 */
@autoinject
export class AutofocusCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement | SVGElement;
    }

    private readonly _element: HTMLElement | SVGElement;

    /**
     * True or empty string to enable autofocus, otherwise false.
     * The default is true.
     */
    @bindable({ primaryProperty: true, defaultValue: true })
    public enabled: boolean | "";

    /**
     * True to make the focus visible, false to make it invisible,
     * or undefined to keep the current visibility.
     * The default is undefined.
     */
    @bindable({ defaultValue: undefined })
    public visible: boolean | undefined;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        if (this.enabled || this.enabled === "")
        {
            const customFocusOptions: IExtendedFocusOptions =
            {
                focusVisible: this.visible
            };

            // Delay focusing the element, to prevent conflicts with the `trap-focus` attribute,
            // which if applied will also attempt to focus an element after a timeout.
            setTimeout(() => setTimeout(() => this._element.focus(customFocusOptions)));
        }
    }
}
