import { Consignor } from "app/model/outfit";

/**
 * Represents the matching criteria for an order group.
 */
export class MatchingCriteria
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.consignors = data.consignors.map(d => new Consignor(d));
            this.tags = data.tags;
        }
        else
        {
            this.consignors = [];
            this.tags = [];
        }
    }

    /**
     * The tags that must match for the criteriea to be fulfilled.
     */
    public tags: string[];

    /**
     * The consignors of which one must match for the criteriea to be fulfilled.
     */
    public consignors: Consignor[];

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            tags: this.tags,
            consignorIds: this.consignors.map(c => c.id)
        };
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        const entity = new MatchingCriteria();
        entity.tags = [...this.tags];
        entity.consignors = [...this.consignors];

        return entity;
    }
}
