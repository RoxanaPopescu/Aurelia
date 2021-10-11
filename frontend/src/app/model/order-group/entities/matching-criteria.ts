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
            this.organizations = data.organizations.map(d => new Consignor(d));
            this.tags = data.tags;
        }
        else
        {
            this.organizations = [];
            this.tags = [];
        }
    }

    /**
     * The tags that must match for the criteriea to be fulfilled.
     */
    public tags: string[];

    /**
     * The organizations of which one must match for the criteriea to be fulfilled.
     */
    public organizations: Consignor[];

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            tags: this.tags,
            consignorIds: this.organizations.map(c => c.id)
        };
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        const entity = new MatchingCriteria();
        entity.tags = [...this.tags];
        entity.organizations = [...this.organizations];

        return entity;
    }
}
