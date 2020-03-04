import { DepartureTimeCriteria } from "./departure-time-criteria";
import { Port } from "./port";

/**
 * Represents a departure time scenario.
 */
export class DepartureTimeScenario
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
            this.criteria = new DepartureTimeCriteria(data.criteria);
            this.ports = data.ports.map(d => new Port(d));
        }
        else
        {
            this.criteria = new DepartureTimeCriteria();
            this.ports = [];
        }
    }

    /**
     * The name of the scenario.
     */
    public name: string;

    /**
     * The matching criteria for the scenario.
     */
    public criteria: DepartureTimeCriteria;

    /**
     * The ports associated with the scenario.
     */
    public ports: Port[];
}
