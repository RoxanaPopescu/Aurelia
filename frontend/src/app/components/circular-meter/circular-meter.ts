import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents the module.
 */
@autoinject
export class CircularMeter
{
    /**
     * The percentage to show
     */
    @bindable
    protected percentage: number = 0;

    /**
     * The percentage to show
     */
    protected dashArraySize: number = 440;
}
