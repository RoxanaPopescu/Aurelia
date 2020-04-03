import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a section that is part of a numbered sequence of sections.
 */
@autoinject
export class NumberedSectionCustomElement
{
    /**
     * The number of the section.
     */
    @bindable
    public number: number;

    /**
     * The heading of the section.
     */
    @bindable
    public heading: string;

    /**
     * True if the section is disabled, otherwise false.
     */
    @bindable
    public disabled: string;
}
