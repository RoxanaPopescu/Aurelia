import { DateTime } from "luxon";
import { TimeOfDay } from "shared/types";
import { Location } from "app/model/shared";
import { OrderStatus } from "./order-status";

export class Order
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.internalId;
        this.slug = data.publicId;
        this.status = new OrderStatus(data.status.name.toLowerCase());
        this.earliestPickupDate = DateTime.fromISO(data.earliestPickupDate, { setZone: true });
        this.earliestPickupTime = TimeOfDay.fromISO(data.earliestPickupTime);
        this.latestPickupDate = DateTime.fromISO(data.latestPickupDate, { setZone: true });
        this.latestPickupTime = TimeOfDay.fromISO(data.latestPickupTime);

        this.pickupLocation = new Location(
        {
            address:
            {
                primary: data.pickupLocation.address,
                secondary: ""
            },
            position: data.pickupLocation.position
        });

        this.deliveryLocation = new Location(
        {
            address:
            {
                primary: data.deliveryLocation.address,
                secondary: ""
            },
            position: data.deliveryLocation.position
        });
    }

    public readonly id: string;

    public readonly slug: string;

    public readonly status: OrderStatus;

    public readonly earliestPickupDate: DateTime;

    public readonly earliestPickupTime: TimeOfDay;

    public readonly latestPickupDate: DateTime;

    public readonly latestPickupTime: TimeOfDay;

    public readonly pickupLocation: Location;

    public readonly deliveryLocation: Location;
}
