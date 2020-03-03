import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents the module.
 */
@autoinject
export class LinearMeter
{
    /**
     * The percentage to show
     */
    @bindable
    public percentage: number;

    /**
     * Gets the width of the individual bar from which iteration it gets
     */
    public barWidth(iteration: number): number
    {
        if (iteration * 10 <= this.percentage)
        {
            return 100;
        }
        if (iteration * 10 > this.percentage && (iteration - 1) * 10 < this.percentage)
        {
            return this.percentage % 10 * 10;
        }

        return 0;
    }
}
