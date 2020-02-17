import { autoinject, bindable } from 'aurelia-framework';

/**
 * Represents the module.
 */
@autoinject
export class Information
{
    /**
     * The position of the pop-up window
     */
    @bindable
    protected position: "right" | "left" | "top" | "bottom" = "right";
}
