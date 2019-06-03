import { autoinject, bindable, bindingMode } from "aurelia-framework";

/**
 * Custom element that represents a group of tabs.
 */
@autoinject
export class TabNavCustomElement
{
    /**
     * The currently selected tab.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: string | undefined;

    /**
     * The appearance to use for the tabs.
     */
    @bindable
    public appearance: "outine" | "solid" | "text";
}
