import { autoinject, bindable, bindingMode } from "aurelia-framework";

/**
 * Custom element that represents a group of tabs.
 */
@autoinject
export class PageTabNavCustomElement
{
    /**
     * The model associated with the currently selected tab, if any.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any | undefined;

    /**
     * Called when the value is about to change.
     * @param context.newValue The new value.
     * @param context.oldValue The old value.
     * @returns False to prevent the change, otherwise true.
     */
    @bindable({ defaultValue: undefined })
    public change: undefined | ((params:
    {
        newValue: any | undefined;
        oldValue: any | undefined;

    }) => undefined | boolean);
}
