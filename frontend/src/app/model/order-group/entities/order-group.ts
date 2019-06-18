import { Consignor } from "app/model/outfit";
import { MatchingCriterias as MatchingCriteria } from "./matching-criteria";

/**
 * Represents an order group used for route planning.
 */
export class OrderGroupInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.name = data.name;
        this.matchingCriterias = data.matchingCriterias.map(mc => new MatchingCriteria(mc));

        const consignors: Consignor[] = [];

        for (const matchingCriteria of this.matchingCriterias)
        {
            consignors.push(...matchingCriteria.consignors);
        }

        this.consignors = [...new Set(consignors)];
    }

    /**
     * The ID of the order group.
     */
    public readonly id: string;

    /**
     * The name of the order group.
     */
    public readonly name: string;

    /**
     * The matching criteria for the group.
     */
    public readonly matchingCriterias: MatchingCriteria[];

    /**
     * The consignors to which the order group applies.
     */
    public readonly consignors: Consignor[];
}
