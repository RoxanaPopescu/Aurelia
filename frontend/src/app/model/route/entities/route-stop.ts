import { Signature, Photo } from "app/model/shared";
import { RouteStopBase } from "./route-stop-base";
import { Pickup } from "./pickup";
import { Delivery } from "./delivery";
import { RouteStopProblem } from "./route-stop-problem";
import clone from "clone";
import { RouteStopActions } from "./route-stop-actions";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class RouteStop extends RouteStopBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any, stopNumber?: number)
    {
        if (data != null)
        {
            super(data, stopNumber);

            this.pickups = data.pickups.map(p => new Pickup(p));
            this.deliveries = data.deliveries.map(d => new Delivery(d));
            this.actions = new RouteStopActions(data.actions);
            this.problems = data.problems.map(p => new RouteStopProblem(p));
            this.selfies = data.selfies.map(p => new Photo(p));
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

        }
        else
        {
            super(undefined, stopNumber);

            this.pickups = [];
            this.deliveries = [];
        }
    }

    /**
     * The pickups to be completed at this stop.
     */
    public readonly pickups: Pickup[];

    /**
     * The deliveries to be completed at this stop.
     */
    public readonly deliveries: Delivery[];

    /**
     * The actions that are required to complete the stop.
     */
    public readonly actions: RouteStopActions;

    /**
     * The problems associated with the stop.
     */
    public readonly problems: RouteStopProblem[];

    /**
     * The selfies captured at the stop to verify the drivers identity and appearance.
     */
    public readonly selfies: Photo[];

    /**
     * The signature captured to prove that the stop was completed.
     */
    public readonly signature?: Signature;

    /**
     * The photo captured to prove that the deliveries were completed.
     */
    public readonly photo?: Photo;

    // TODO: Should be removed - replaced by actions
    public readonly signatureRequired: boolean;
    public readonly photoRequired: boolean;

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

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}
