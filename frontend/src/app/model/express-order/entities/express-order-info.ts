import { DateTime, Duration } from "luxon";
import { TimeOfDay } from "shared/types";
import { Location } from "app/model/shared";
import { Outfit } from "shared/src/model/logistics/outfit";
import { VehicleType } from "app/model/vehicle";
import { AccentColor } from "resources/styles";
import { SearchModel } from "app/model/search-model";
import { computedFrom } from "aurelia-binding";

export class ExpressOrderInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     * @param vehicleType The vehicle type required for the order.
     */
    public constructor(data: any, vehicleType: VehicleType)
    {
        this.id = data.internalId;
        this.slug = data.publicId;
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

        // Properties not found on RouteInfo:

        this.timeToDeadline = Duration.fromObject({ seconds: data.timeToDeadline });
        this.accent = data.accent;
        this.consignor = new Outfit(data.consignor);
        this.vehicleType = vehicleType;
        this.pickupPostalCode = data.pickupPostalCode;
        this.deliveryPostalCode = data.deliveryPostalCode;
        this.stopCount = data.stopCount;
    }

    public readonly id: string;

    public readonly slug: string;

    public readonly earliestPickupDate: DateTime;

    public readonly earliestPickupTime: TimeOfDay;

    public readonly latestPickupDate: DateTime;

    public readonly latestPickupTime: TimeOfDay;

    public readonly pickupLocation: Location;

    public readonly deliveryLocation: Location;

    // Properties not found on RouteInfo:

    public readonly accent: AccentColor;

    public readonly timeToDeadline: Duration;

    public readonly consignor: Outfit;

    public readonly vehicleType: VehicleType;

    public readonly pickupPostalCode: number;

    public readonly deliveryPostalCode: number;

    public readonly stopCount: number;

    public selected: boolean;

    @computedFrom("selected")
    public get selectionAccent(): string // TODO: We should define a type for highlight colors.
    {
        return this.selected ? "primary" : "neutral";
    }

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);
}
