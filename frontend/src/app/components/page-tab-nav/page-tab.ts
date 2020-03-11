import { autoinject, bindable } from "aurelia-framework";
import { PageTabNavCustomElement } from "./page-tab-nav";

/**
 * Custom element that represents a single tab.
 */
@autoinject
export class PageTabCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param pageTabNav The `tab-nav`component to which this tab belongs.
     */
    public constructor(pageTabNav: PageTabNavCustomElement)
    {
        this.pageTabNav = pageTabNav;
    }

    /**
     * The `tab-nav`component to which this tab belongs.
     */
    protected pageTabNav: PageTabNavCustomElement;

    /**
     * The name identifying the tab.
     */
    @bindable
    public name: string | undefined;

    /**
     * True to disable the tab, otherwise false.
     */
    @bindable
    public disabled: boolean | undefined;

    /**
     * True to indicate that the state of the tab is invalid, otherwise false.
     */
    @bindable
    public invalid: boolean | undefined;

    /**
     * Called when the tab is clicked.
     */
    protected onClick(): void
    {
        // Call the change callback, if specified.
        if (this.pageTabNav.change != null)
        {
            const allowChange = this.pageTabNav.change({ newValue: this.name, oldValue: this.pageTabNav.value });

            // Did the callback cancel the change?
            if (allowChange === false)
            {
                return;
            }
        }

        // Change the of the `tab-nav` value.
        this.pageTabNav.value = this.name;
    }
}
