import { Consignor } from "app/model/outfit";

/**
 * Represents the matching criteria for an order group.
 */
export class MatchingCriterias
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.consignors = data.consignors.map(d => new Consignor(d));
        this.tags = data.tags;
    }

    /**
     * The tags that must match for the criteriea to be fulfilled.
     */
    public tags: string[];

    /**
     * The consignors of which one must match for the criteriea to be fulfilled.
     */
    public consignors: Consignor[];
}
