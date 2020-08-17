import { ICurrencyValue } from "shared/types/values/currency-value";
import { Outfit, Consignor } from "app/model/outfit";
import { VehicleType } from "app/model/vehicle";
import { Metadata } from "app/model/shared";

export class RouteTemplateInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.slug = data.slug;
            this.ownerId = data.ownerId;
            this.routeOwner = new Consignor(data.routeOwner);
            this.name = data.name;
            this.description = data.description;
            this.reference = data.reference;
            this.price = data.price;
            this.driverInstructions = data.driverInstructions;
            this.vehicleType = VehicleType.get(data.vehicleTypeId);
            this.metadata = new Metadata(data.metadata);
        }
    }

    /**
     * The ID of the route template.
     */
    public id: string;

    /**
     * The ID of the route template.
     */
    public slug: string;

    /**
     * The ID of the route template owner.
     */
    public ownerId: string;

    /**
     * The ID of the route owner.
     */
    public routeOwner: Outfit;

    /**
     * The name of the route template.
     */
    public name: string;

    /**
     * The description of the route template.
     */
    public description?: string;

    /**
     * The metadata for the entity.
     */
    public metadata: Metadata | undefined;

    /**
     * The type of vehicle required for the route.
     */
    public readonly vehicleType: VehicleType;

    /**
     * The reference to use for routes based on this template.
     */
    public readonly reference: string;

    /**
     * The price, ex. VAT, to use for routes based on this template.
     */
    public price?: Partial<ICurrencyValue>;

    /**
     * The driver instructions to use for routes based on this template.
     */
    public driverInstructions: string | undefined;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;
        data.routeOwnerId = this.routeOwner.id;
        data.vehicleTypeId = this.vehicleType.id;

        return data;
    }
}
