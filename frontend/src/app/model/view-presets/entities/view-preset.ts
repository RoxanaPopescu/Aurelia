import { ViewPresetType } from "./view-preset-type";

/**
 * Represents a named view preset.
 */
export class ViewPreset
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.state = data.state;
        this.shared = data.shared;
    }

    /**
     * The ID of the view preset.
     */
    public id: string;

    /**
     * The type of the view preset.
     */
    public type: ViewPresetType;

    /**
     * The name of the view preset.
     */
    public name: string;

    /**
     * The view state represented by the view preset.
     */
    public state: any;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    public shared: boolean;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            state: this.state,
        };
    }
}
