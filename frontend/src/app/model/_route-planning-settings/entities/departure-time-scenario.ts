import { DepartureTimeCriteria } from "./departure-time-criteria";
import { Gate } from "./gate";

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
            this.gates = data.gates.map(d => new Gate(d));
        }
        else
        {
            this.criteria = new DepartureTimeCriteria();
            this.gates = [];
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
     * The gates associated with the scenario.
     */
    public gates: Gate[];
}
