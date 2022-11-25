import { DateTime } from "luxon";

/**
 * Represents a notification for the user.
 */
export class Notification
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.createdDateTime = DateTime.fromISO(data.createdDateTime, { setZone: true });
        this.heading = data.heading;
        this.body = data.body;
        this.details = data.details;
        this.url = data.url;
        this.seen = data.seen;
    }

    /**
     * The ID of the notification.
     */
    public readonly id: string;

    /**
     * The date and time at which the notification was created.
     */
    public readonly createdDateTime: DateTime;

    /**
     * The heading text of the notification.
     */
    public readonly heading: string;

    /**
     * The body text of the notification, if any.
     */
    public readonly body: string | undefined;

    /**
     * The details text of the notification, if any.
     */
    public readonly details: string | undefined;

    /**
     * The URL associated with the notification, if any.
     */
    public readonly url?: string;

    /**
     * True if the notification has been seen by the user, otherwise false.
     */
    public seen: boolean;
}
