import { Location } from "app/model/shared";
import { DepartureTimeScenario } from "./departure-time-scenario";

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
        }
        else
        {
            this.startLocation = new Location();
            this.scenarios = [];
        }
    }

    /**
     * The location from which the driver must depart.
     */
    public startLocation: Location;

    /**
     * The scenarios in which settings should be applied.
     */
    public scenarios: DepartureTimeScenario[];
}
