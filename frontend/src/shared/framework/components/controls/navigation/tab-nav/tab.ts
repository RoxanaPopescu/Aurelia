import { autoinject, bindable } from "aurelia-framework";
import { TabNavCustomElement } from "./tab-nav";

/**
 * Custom element that represents a single tab.
 */
@autoinject
export class TabCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param tabNav The `tab-nav`component to which this tab belongs.
     */
    public constructor(tabNav: TabNavCustomElement)
    {
        this.tabNav = tabNav;
    }

    /**
     * The `tab-nav`component to which this tab belongs.
     */
    protected tabNav: TabNavCustomElement;

    /**
     * The name identifying the tab.
     */
    @bindable
    public name: string | undefined;

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
        this.tabNav.value = this.name;
    }
}
