import { PortSlot } from "./port-slot";

/**
 * Represents a port associated with a departure time scenario.
 */
export class Port
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
     * The name identifying the port.
     */
    public name: string;

    /**
     * The slots associated with the port.
     */
    public slots: PortSlot[];
}
