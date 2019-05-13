import { autoinject, bindable, bindingMode } from "aurelia-framework";

/**
 * Represents a data table.
 */
@autoinject
export class DataTableCustomElement
{
    /**
     * The selection mode to use.
     */
    @bindable({ defaultValue: "none" })
    public selection: "none" | "single" | "multiple";

    /**
     * Called when the select all option is checked or unchecked.
     */
    @bindable
    public toggleAll: () => void;

    /**
     * The sorting options to use.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public sorting = {};
}
