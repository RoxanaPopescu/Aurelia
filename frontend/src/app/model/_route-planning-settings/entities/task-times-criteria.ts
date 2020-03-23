/**
 * Represents the matching criteria for a task times scenario.
 */
export class TaskTimesCriteria
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.orderTagsAllRequired = data.orderTagsAllRequired;
            this.orderTagsOneRequired = data.orderTagsOneRequired;
        }
        else
        {
            this.orderTagsAllRequired = [];
            this.orderTagsOneRequired = [];
        }
    }

    /**
     * The order tags matched by this criteria, where all the specified tags must match.
     */
    public orderTagsAllRequired: string[];

    /**
     * The order tags matched by this criteria, where at least one of the specified tags match.
     */
    public orderTagsOneRequired: string[];
}
