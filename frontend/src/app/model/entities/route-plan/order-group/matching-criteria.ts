import { Consignor } from "../../outfit/consignor";

/**
 * Represents th matching criteria for an order group.
 */
export class MatchingCriterias
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.zipRanges = this.getZipRangeString(data.zipRanges);
        this.consignors = data.consignors.map(c => new Consignor(c));
        this.tags = data.tags;
    }

    /**
     * The zip ranges to match, formatted as an array of strings.
     */
    public zipRanges: string[];

    /**
     * The tags to match.
     */
    public tags: string[];

    /**
     * The consignors to match.
     */
    public consignors: Consignor[];

    /**
     * Gets an array of strings describing the zip ranges.
     * @param data The data describing the zip ranges.
     */
    private getZipRangeString(data: any): string[]
    {
        const array: string[] = [];

        if (data.from && data.to)
        {
            if (data.from === data.to)
            {
                array.push(`${data.from}`);
            }
            else
            {
                array.push(`${data.from} – ${data.to}`);
            }
        }

        return array;
    }
}
