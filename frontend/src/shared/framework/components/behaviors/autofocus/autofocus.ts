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
     * True or an empty string to enable autofocus, otherwise false.
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
     * The delay before the element is focused, or undefined to focus the element immediately.
     * The default is undefined.
     */
    @bindable({ defaultValue: undefined })
    public delay: number | undefined;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Delay focusing the element, to prevent conflicts with the `trap-focus` attribute,
        // which if applied will also attempt to focus an element after a timeout.
        setTimeout(() => setTimeout(() =>
        {
            if (this.enabled === true || this.enabled === "")
            {
                const customFocusOptions: IExtendedFocusOptions =
                {
                    focusVisible: this.visible
                };

                this._element.focus(customFocusOptions);
            }

        }), this.delay);
    }

    /**
     * Called by the framework when the `enabled` property changes.
     * Focuses the element if the property changed to true.
     */
    protected enabledChanged(): void
    {
        if (this.enabled === true)
        {
            const customFocusOptions: IExtendedFocusOptions =
            {
                focusVisible: this.visible
            };

            this._element.focus(customFocusOptions);
        }
    }
}
