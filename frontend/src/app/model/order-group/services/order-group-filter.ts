/**
 * Represents the filters to use when getting the list order groups.
 */
export interface IOrderGroupFilter
{
    /**
     * The text that must be found somewhere in the order group data.
     */
    text?: string;

    /**
     * The IDs of the consignors that must be associated with the order group
     */
    consignorIds?: string[];

    /**
     * The tags that must be associated with the order group
     */
    tags?: string[];
}
