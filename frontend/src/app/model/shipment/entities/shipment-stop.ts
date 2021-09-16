import { Collo } from "app/model/collo";
import { DateTimeRange } from "shared/types";
import { Location } from "app/model/shared";

export class ShipmentStop {
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.arrivalTimeFrame = new DateTimeRange(data.arrivalTimeFrame, { setZone: true });
        this.location = new Location(data.location);

        if (data.colli != null)
        {
            this.colli = data.colli.map(c => new Collo(c))
        }
        else
        {
            this.colli = [];
        }
    }

    /**
     * The GUID id
     */
    public id: string;

    /**
     * The colli for this order
     * 0...x because we could have shipments for ad-hoc routes
     */
    public colli: Collo[];

    /**
     * The timeframe within which the driver must arrive.
     */
    public arrivalTimeFrame: DateTimeRange;

    /**
     * The address identifying the location of the stop.
     */
    public location: Location;
}
