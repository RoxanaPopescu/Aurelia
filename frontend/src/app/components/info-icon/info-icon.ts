import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents an icon that shows additional info when hovered.
 */
@autoinject
export class InfoIcon
{
    /**
     * The position of the popover.
     */
    @bindable
    public position: "right" | "left" | "top" | "bottom" = "right";
}
