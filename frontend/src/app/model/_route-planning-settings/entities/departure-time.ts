import { Location } from "app/model/shared";
import { DepartureTimeScenario } from "./departure-time-scenario";
import clone from "clone";

/**
 * Represents settings related to a departure time.
 */
export class DepartureTime
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.startLocation = new Location(data.startLocation);
            this.scenarios = data.scenarios.map(d => new DepartureTimeScenario(d));
            this.name = data.name;
        }
        else
        {
            this.startLocation = new Location();
            this.scenarios = [];
            this.name = "";
        }
    }

    /**
     * The name of the location from which the driver must depart from.
     */
    public name: string;

    /**
     * The location from which the driver must depart.
     */
    public startLocation: Location;

    /**
     * The scenarios in which settings should be applied.
     */
    public scenarios: DepartureTimeScenario[];

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}
