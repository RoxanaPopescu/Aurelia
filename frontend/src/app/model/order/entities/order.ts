import { OrderStatus } from "./order-status";
import { OrderStop } from "./order-stop";
import { Collo } from "shared/src/model/logistics/order";
import clone from "clone";

export class Order
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.slug = data.slug;
        this.relationalId = data.relationalId;
        this.consignorId = data.consignorId;

        this.state =
        {
            canBeCancelled: data.state.canBeCancelled,
            canBeEdited: data.state.canBeEdited,
            isDeleted: data.state.isDeleted,
            status: new OrderStatus(data.state.status.name)
        };

        this.pickup = new OrderStop(data.pickup, "pickup");
        this.delivery = new OrderStop(data.delivery, "delivery");

        this.tags = data.tags;
        this.requirements = data.requirements;

        this.actualColli = data.actualColli.map(ac => new Collo(ac));
        this.estimatedColli = data.estimatedColli.map(ec => new Collo(ec));
    }

    public readonly id: string;

    public readonly slug: string;

    public readonly relationalId: string;
    
    public readonly consignorId: string;

    public state:
    {
        canBeCancelled: boolean;
        canBeEdited: boolean;
        isDeleted: boolean;
        status: OrderStatus;
    };

    public pickup: OrderStop;

    public delivery: OrderStop;

    public tags: string[];

    public requirements:
    {
        slug: string;
        isSelected: boolean;
    }[];

    public actualColli: Collo[];

    public estimatedColli: Collo[];

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            id: this.id,
            slug: this.slug,
            relationalId: this.relationalId,
            state: this.state,
            pickup: this.pickup.toJSON(),
            delivery: this.delivery.toJSON(),
            tags: this.tags,
            requirements: this.requirements,
            actualColli: this.actualColli,
            estimatedColli: this.estimatedColli
        };
    }
}
