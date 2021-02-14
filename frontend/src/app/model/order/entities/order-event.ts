import { DateTime } from "luxon";
import { OrderEventType } from "./order-event-type";

export class OrderEvent
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.eventType = new OrderEventType(data.eventType);
        this.eventTime = DateTime.fromISO(data.eventTime, { setZone: true });
        this.data = data.data;

        if (this.data?.timeOfEvent != null)
        {
            this.data.timeOfEvent = DateTime.fromISO(this.data.timeOfEvent, { setZone: true });
        }

        if (this.data?.signature?.date != null)
        {
            this.data.signature.date = DateTime.fromISO(this.data.signature.date, { setZone: true });
        }

        if (this.data?.photo?.date != null)
        {
            this.data.photo.date = DateTime.fromISO(this.data.photo.date, { setZone: true });
        }
    }

    public readonly id: string;

    public readonly eventType: OrderEventType;

    public readonly eventTime: DateTime;

    public readonly data: any;
}
