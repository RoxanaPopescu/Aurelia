import clone from "clone";
import { DataColorIndex } from "resources/styles";
import { AutoContractorAssignmentConditions } from "./auto-contractor-assignment-conditions";

export class AutoContractorAssignmentRule
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any, color?: DataColorIndex)
    {
        if (data != null)
        {
            this.id = data.id;
            this.label = data.label;
            this.outfitId = data.outfitId;
            this.priority = data.priority;
            this.fulfillerId = data.fulfillerId;
            this.routeTagsAllRequired = data.routeTagsAllRequired;
            this.routeTagsOneRequired = data.routeTagsOneRequired;
            this.conditions = new AutoContractorAssignmentConditions(data.conditions);
            this.color = color as any;

            this._originaldEntityJson = JSON.stringify(this);
        }
        else
        {
            this.priority = 0;
            this.conditions = new AutoContractorAssignmentConditions();
            this.color = 1;
        }
    }

    private readonly _originaldEntityJson: string | undefined;

    public readonly id: string;

    public label: string;

    public outfitId: string;

    public priority: number;

    public fulfillerId: string;

    public routeTagsAllRequired: string[];

    public routeTagsOneRequired: string[];

    public conditions: AutoContractorAssignmentConditions;

    /**
     * The index of the color to use when presenting the area.
     */
    public color: DataColorIndex;

    /**
     * True if the area is selected on the map, otherwise false.
     */
    public selected = true;

    /**
     * True if this instance has unsaved changes, otherwise false.
     */
    public get hasChanges(): boolean
    {
        return this._originaldEntityJson !== JSON.stringify(this);
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;

        delete data._originaldEntityJson;
        delete data.color;
        delete data.selected;

        data.routeTagsAllRequired = this.routeTagsAllRequired ?? [];
        data.routeTagsOneRequired = this.routeTagsOneRequired ?? [];

        return data;
    }
}
