import { autoinject, bindable } from "aurelia-framework";
import tabbable from "tabbable";

/**
 * Custom attribute that forwards focus to the specified element, or to the first
 * focusable element, within the element to which this attribute is applied.
 */
@autoinject
export class ForwardFocusCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;

    /**
     * True or an empty string to enable focus forwarding, otherwise false.
     * The default is true.
     */
    @bindable({ primaryProperty: true, defaultValue: true })
    public enabled: boolean | "";

    /**
     * The element to which focus should be forwarded, or undefined to forward focus to
     * the first focusable element, within the element to which this attribute is applied.
     */
    @bindable
    public target: HTMLElement | SVGElement | undefined;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        const originalFocusFunc = this._element.focus.bind(this._element);

        // Intercept and forward programmatic focus, if possible.
        this._element.focus = (options: any) =>
        {
            if (this.enabled || this.enabled === "")
            {
                const nextElement = this.target || tabbable(this._element)[0];

                if (nextElement)
                {
                    nextElement.focus(options);

                    return;
                }
            }

            originalFocusFunc(options);
        };

        // Forward non-programmatic focus, if possible.
        this._element.addEventListener("focus", (event: FocusEvent) =>
        {
            if (this.enabled || this.enabled === "")
            {
                const nextElement = this.target || tabbable(this._element)[0];

                if (nextElement)
                {
                    nextElement.focus();

                    event.preventDefault();
                }
            }
        });
    }
}
