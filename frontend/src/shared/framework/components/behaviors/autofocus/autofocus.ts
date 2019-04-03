import { autoinject } from "aurelia-framework";
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
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        setTimeout(() => this._element.focus());
    }
}
