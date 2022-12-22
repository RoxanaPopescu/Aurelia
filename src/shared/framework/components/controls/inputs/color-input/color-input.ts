import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { Id } from "shared/utilities";

/**
 * Custom element representing a color input.
 */
@autoinject
export class ColorInputCustomElement
{
    /**
     * The unique ID of the control.
     */
    protected id = Id.sequential();

    /**
     * The value of the input, or undefined if the input is empty.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: number | undefined;

    /**
     * True if the input is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * True if the input is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;
}
