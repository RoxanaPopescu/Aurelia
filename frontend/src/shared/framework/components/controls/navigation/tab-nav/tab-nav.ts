import { autoinject, bindable, bindingMode } from "aurelia-framework";

/**
 * Custom element that represents a set of tabs.
 */
@autoinject
export class TabNavCustomElement
{
    /**
     * The currently selected tab.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: string;
}
