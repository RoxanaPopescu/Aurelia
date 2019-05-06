import { autoinject, bindable } from "aurelia-framework";
import { TabNavCustomElement } from "./tab-nav";

/**
 * Custom element that represents a single tab.
 */
@autoinject
export class TabCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param tabNav The `tab-nav`component owning this tab.
     */
    public constructor(tabNav: TabNavCustomElement)
    {
        this.tabNav = tabNav;
    }

    /**
     * The `tab-nav`component owning this tab.
     */
    protected tabNav: TabNavCustomElement;

    /**
     * The name identifying the tab.
     */
    @bindable
    public name: string;

    /**
     * Called when the tab is clicked.
     */
    protected onClick(): void
    {
        this.tabNav.value = this.name;
    }
}
