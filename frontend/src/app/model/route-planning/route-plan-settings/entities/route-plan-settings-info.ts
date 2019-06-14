/**
 * Represents info about settings used when planning a route.
 */
export class RoutePlanSettingsInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.name = data.name;
        this.specialConditionCount = data.parameters.specialConditions.length;
    }

    /**
     * The ID of the settings.
     */
    public readonly id: string;

    /**
     * The name of the settings.
     */
    public readonly name: string;

    /**
     * The number of special conditions in the settings.
     */
    public readonly specialConditionCount: number;
}
