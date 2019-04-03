import { Address } from "./address";
import { Position } from "./position";

/**
 * Represents a coordinate and address
 */
export class Location
{
    public constructor(data: any)
    {
        this.address = new Address(data.address);

        if (data.position != null)
        {
            this.position = new Position(data.position);
        }
    }

    /**
     * The address of the location
     */
    public address: Address;

    /**
     * The position of the location.
     */
    public position?: Position;
}
