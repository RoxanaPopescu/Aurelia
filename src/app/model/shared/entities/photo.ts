import { DateTime } from "luxon";
import { Position } from "./position";

/**
 * Represents a photo.
 */
export class Photo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.date = DateTime.fromISO(data.date, { setZone: true });
        this.imageUrl = data.imageUrl;
    }

    /**
     * The date and time at which the photo was captured.
     */
    public date: DateTime;

    /**
     * The URL for the photo.
     */
    public imageUrl: string;

    /**
     * The position at which the photo was captured.
     */
    public position: Position;
}
