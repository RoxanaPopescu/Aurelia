import { GateSlot } from "./gate-slot";

/**
 * Represents a gate associated with a departure time scenario.
 */
export class Gate
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
            this.slots = data.slots;
        }
        else
        {
            this.slots = [];
        }
    }

    /**
     * The name identifying the gate.
     */
    public name: string;

    /**
     * The slots associated with the gate.
     */
    public slots: GateSlot[];
}
