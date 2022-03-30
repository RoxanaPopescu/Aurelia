import { ViewPresetType } from "./view-preset-type";

/**
 * Represents the data needed to create a view preset.
 */
export interface IViewPresetInit
{
    /**
     * The type of the view preset.
     */
    type: ViewPresetType;

    /**
     * The name of the view preset.
     */
    name: string;

    /**
     * The view state represented by the view preset.
     */
    state: any;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    shared: boolean;
}
