import { Signature, Photo } from "app/model/shared";
import { RouteStopBase, Pickup, Delivery } from "app/model/routes";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class RouteStop extends RouteStopBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any, stopNumber: number)
    {
        super(data, stopNumber);

        this.signatureRequired = data.signatureRequired;
        this.photoRequired = data.photoRequired;

        if (data.signature != null)
        {
            this.signature = new Signature(data.signature);
        }

        if (data.photo != null)
        {
            this.photo = new Photo(data.photo);
        }

        if (data.pickups != null)
        {
            this.pickups = data.pickups.map(p => new Pickup(p));
        }

        if (data.deliveries != null)
        {
            this.deliveries = data.deliveries.map(d => new Delivery(d));
        }
    }

    /**
     * True if a signature is required, otherwise false.
     */
    public readonly signatureRequired: boolean;

    /**
     * The signature captured to prove that the stop was completed.
     */
    public readonly signature?: Signature;

    /**
     * True if a photo is required, otherwise false.
     */
    public readonly photoRequired: boolean;

    /**
     * The photo captured to prove that the deliveries were completed.
     */
    public readonly photo?: Photo;

    /**
     * The pickups to be completed at this stop.
     */
    public readonly pickups: Pickup[];

    /**
     * The deliveries to be completed at this stop.
     */
    public readonly deliveries: Delivery[];

    /**
     * True if there is an alert for this route stop, otherwise false.
     */
    public get hasAlert(): boolean
    {
        return (
            this.getHasAlert() ||
            this.pickups.some(p => p.colli.some(c => c.status.accent.pickup === "negative")) ||
            this.deliveries.some(d => d.colli.some(c => c.status.accent.delivery === "negative"))
        );
    }
}
