import { Container } from "aurelia-framework";
import { LocaleService } from "shared/localization";

let supportedVehicleTypes: VehicleType[];

/**
 * Represents a vehicle types.
 */
export class VehicleType
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        const localeService = Container.instance.get(LocaleService);

        this.deprecated = data.deprecated;
        this.id = data.id;
        this.slug = data.slug;
        this.maxHeight = data.maxHeight;
        this.maxWidth = data.maxWidth;
        this.maxLength = data.maxLength;
        const localeCode = localeService.locale.code.substring(0, 2);
        if (data.name[localeCode] == null)
        {
            this.name = data.name["en"];
        }
        else
        {
            this.name = data.name[localeCode];
        }
        this.images = data.images;
    }

    /**
     * True if the vehicle type is deprecated, otherwise false.
     */
    public readonly deprecated: boolean;

    /**
     * The ID of the vehicle type.
     */
    public readonly id: string;

    /**
     * The slug identifying the vehicle type.
     */
    public readonly slug: string;

    /**
     * The height of the cargo space.
     */
    public readonly maxHeight: number;

    /**
     * The width of the cargo space.
     */
    public readonly maxWidth: number;

    /**
     * The length of the cargo space.
     */
    public readonly maxLength: number;

    /**
     * The max weight of the cargo.
     */
    public readonly maxWeight: number;

    /**
     * The localized name of the vehicle type.
     */
    public readonly name: string;

    /**
     * The URLs for the images representing the vehicle type, indexed by size.
     */
    public readonly images: { [type: string]: string };

    /**
     * Gets max payload dimensions
     */
    public get maxPayloadDimensions(): number
    {
        return this.maxHeight * this.maxLength * this.maxWidth;
    }

    /**
     * Gets the vehicle type with the specified ID.
     */
    public static get(id: string): VehicleType
    {
        return supportedVehicleTypes.find(vt => vt.id === id)!;
    }

    /**
     * Gets the supported vehicle types.
     */
    public static getAll(): VehicleType[]
    {
        return supportedVehicleTypes;
    }

    /**
     * Sets the supported vehicle types.
     */
    public static setAll(vehicleTypes: VehicleType[]): void
    {
        supportedVehicleTypes = vehicleTypes;
    }
}
