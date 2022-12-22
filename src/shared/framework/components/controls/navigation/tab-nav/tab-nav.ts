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
     * Called when the value is about to change.
     * @param context.newValue The new value.
     * @param oldValue The old value.
     * @returns False to prevent the change, otherwise true.
     */
    @bindable({ defaultValue: undefined })
    public change: undefined | ((params:
    {
        newValue: string | undefined;
        oldValue: string | undefined;

    }) => void | boolean);

    /**
     * The appearance to use for the tabs.
     */
    @bindable
    public appearance: "tabs" | "solid" | "outline" | "text";
}
