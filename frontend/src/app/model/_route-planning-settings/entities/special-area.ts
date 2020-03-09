import { GeoJsonPolygon } from "shared/types";
import { SpecialAreaScenario } from "./special-area-scenario";

/**
 * Represents settings related to a special area.
 */
export class SpecialArea
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.name = data.name;
            this.color = data.color;
            this.polygon = data.polygon;
            this.scenarios = data.scenarios;
        }
        else
        {
            this.scenarios = [];

            // TODO: How do we assign a color?
        }
    }

    /**
     * The name of the special area.
     */
    public name: string;

    /**
     * The index of the color to use when presenting the area.
     */
    public color: number;

    /**
     * The polygon defining the geographic area.
     */
    public polygon: GeoJsonPolygon;

    /**
     * The scenarios in which settings should be applied.
     */
    public scenarios: SpecialAreaScenario[];
}
