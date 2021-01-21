import { DateTime } from "luxon";
import { TimeOfDay } from "shared/types";
import { Location } from "app/model/shared";
import { OrderStatus } from "./order-status";
import { OrderColliInfo } from "..";

export class OrderInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.internalId;
        this.relationalId = data.relationalId;
        this.slug = data.publicId;
        this.tags = data.tags;
        this.actualColliInfo = new OrderColliInfo(data.actualColliInfo);
        this.estimatedColliInfo = new OrderColliInfo(data.estimatedColliInfo);
        this.status = new OrderStatus(data.status.name);
        this.earliestPickupDate = DateTime.fromISO(data.earliestPickupDate, { setZone: true });
        // tslint:disable-next-line: deprecation
        this.earliestPickupTime = TimeOfDay.fromString(data.earliestPickupTime);
        this.latestPickupDate = DateTime.fromISO(data.latestPickupDate, { setZone: true });
        // tslint:disable-next-line: deprecation
        this.latestPickupTime = TimeOfDay.fromString(data.latestPickupTime);

        this.earliestDeliveryDate = DateTime.fromISO(data.earliestDeliveryDate, { setZone: true });
        // tslint:disable-next-line: deprecation
        this.earliestDeliveryTime = TimeOfDay.fromString(data.earliestDeliveryTime);
        this.latestDeliveryDate = DateTime.fromISO(data.latestDeliveryDate, { setZone: true });
        // tslint:disable-next-line: deprecation
        this.latestDeliveryTime = TimeOfDay.fromString(data.latestDeliveryTime);

        this.pickupLocation = new Location(
        {
            address:
            {
                primary: data.pickupLocation.address,
                secondary: ""
            },
            position: data.pickupLocation.position,
            timeZone: data.pickupLocation.timeZone
        });

        this.deliveryLocation = new Location(
        {
            address:
            {
                primary: data.deliveryLocation.address,
                secondary: ""
            },
            position: data.deliveryLocation.position,
            timeZone: data.pickupLocation.timeZone
        });
    }

    public readonly id: string;

    public readonly relationalId: string;

    public readonly slug: string;

    public readonly tags: string[];

    public readonly status: OrderStatus;

    public readonly earliestPickupDate: DateTime;

    // tslint:disable-next-line: deprecation
    public readonly earliestPickupTime: TimeOfDay;

    public readonly latestPickupDate: DateTime;

    // tslint:disable-next-line: deprecation
    public readonly latestPickupTime: TimeOfDay;

    public readonly earliestDeliveryDate: DateTime;

    // tslint:disable-next-line: deprecation
    public readonly earliestDeliveryTime: TimeOfDay;

    public readonly latestDeliveryDate: DateTime;

    // tslint:disable-next-line: deprecation
    public readonly latestDeliveryTime: TimeOfDay;

    public readonly pickupLocation: Location;

    public readonly deliveryLocation: Location;

    public readonly actualColliInfo: OrderColliInfo;

    public readonly estimatedColliInfo: OrderColliInfo;
}
