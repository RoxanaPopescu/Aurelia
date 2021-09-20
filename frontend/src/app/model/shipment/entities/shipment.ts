import { ShipmentStop } from "./shipment-stop";

export class Shipment
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.pickup = new ShipmentStop(data.pickup);
        this.delivery = new ShipmentStop(data.delivery);
    }

    /**
     * The GUID id
     */
    public id: string;

    /**
     * The pickup stop
     */
    public pickup: ShipmentStop;

    /**
     * The delivery stop
     */
    public delivery: ShipmentStop;
}
