import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";

/**
 * Represents a section of data, which may optionally
 * be toggled between an expanded and collapsed state.
 */
@autoinject
export class DataSectionCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;

    /**
     * True if the header slot is empty, otherwise false.
     */
    @computedFrom("_element.au.controller.view.slots.header.children.length")
    protected get headerSlotEmpty(): boolean
    {
        // Get elements within the header slot.
        const elements = (this._element as any).au.controller.view.slots.header.children as HTMLElement[];

        // Determine whether any non-comment elements exist.
        return !elements.some(e => e.nodeType !== 8);
    }

    /**
     * True if the default slot is empty, otherwise false.
     */
    @computedFrom("_element.au.controller.view.slots['__au-default-slot-key__'].children.length")
    protected get defaultSlotEmpty(): boolean
    {
        // Get elements within the default slot.
        const elements = (this._element as any).au.controller.view.slots["__au-default-slot-key__"].children as HTMLElement[];

        // Determine whether any non-comment elements exist.
        return !elements.some(e => e.nodeType !== 8);
    }

    /**
     * True if the section is expanded, otherwise false.
     */
    @bindable({ defaultValue: true, defaultBindingMode: bindingMode.twoWay })
    public expanded: boolean;

    /**
     * True to allow the section to be toggled between expanded and collapsed,
     * otherwise false.
     */
    @bindable({ defaultValue: false })
    public toggle: boolean;

    /**
     * True to indicate that the state of the section is invalid,
     * false to indicate that the state of the section is valid,
     * or undefined to set the validity based on input validation.
     */
    @bindable
    public invalid: boolean | undefined;

    /**
     * Toggles the expanded state of the section.
     */
    protected onHeaderClick(): void
    {
        if (this.toggle)
        {
            this.expanded = !this.expanded;
        }
    }
}
