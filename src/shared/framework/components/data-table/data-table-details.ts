import { autoinject, bindable } from "aurelia-framework";
import { AccentColor } from "resources/styles";

/**
 * Represents a details row in a data table, which spans all columns.
 */
@autoinject
export class DataTableDetailsCustomElement
{
    /**
     * The accent to apply to the row, or undefined to apply no accent.
     */
    @bindable
    public accent: AccentColor | undefined;
}
