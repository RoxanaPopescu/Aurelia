import { autoinject, bindable, bindingMode } from "aurelia-framework";

/**
 * Represents a section within a page, which may optionally
 * be toggled between an expanded and collapsed state.
 */
@autoinject
export class PageSectionCustomElement
{
    /**
     * True if the header slot is empty, otherwise false.
     */
    protected headerSlotEmpty = true;

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
     * True to use a sticky header, otherwise false.
     */
    @bindable({ defaultValue: false })
    public sticky: boolean;

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
