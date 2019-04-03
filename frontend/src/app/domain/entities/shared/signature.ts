import { DateTime } from "luxon";

/**
 * Represents a signature.
 */
export class Signature
{
    public constructor(data: any)
    {
        this.date = DateTime.fromISO(data.date, { setZone: true });
        this.imageUrl = data.imageUrl;
        this.name = data.name;
    }

    /**
     * The date and time at which the signature was captured.
     */
    public date: DateTime;

    /**
     * The URL for the image representing the captured signature.
     */
    public imageUrl: string;

    /**
     * The name of the person providing the signature.
     */
    public name: string;
}