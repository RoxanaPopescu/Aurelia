import { Address } from "./address";
import { Position } from "./position";
import { IANAZone } from "luxon";

/**
 * Represents a coordinate and address
 */
export class Location
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.address = new Address(data.address);

            if (data.position != null)
            {
                this.position = new Position(data.position);
            }

            if (data.timeZone != null)
            {
                this.timeZone = new IANAZone(data.timeZone);
            }
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

    /**
     * The IANA Time Zone Identifier for the time zone associated with the location.
     */
    public timeZone: IANAZone;
}
