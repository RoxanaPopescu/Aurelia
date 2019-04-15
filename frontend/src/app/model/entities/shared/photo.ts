import { DateTime } from "luxon";
import { Position } from "./position";

/**
 * Represents a photo.
 */
export class Photo
{
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