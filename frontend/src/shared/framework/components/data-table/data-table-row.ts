import { autoinject, containerless, bindable } from "aurelia-framework";

/**
 * Represents a row in a data table.
 */
@containerless
@autoinject
export class DataTableRowCustomElement
{
    @bindable
    public href: string | undefined;
}
