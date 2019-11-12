import { DateTime, Duration } from "luxon";
import { Fulfiller, Consignor } from "app/model/outfit";
import { ICurrencyValue } from "shared/types/values/currency-value";

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
            this.reference = data.reference;
            this.consignor = new Fulfiller(data.consignor);
            this.price = data.price;
            this.startDateTime = DateTime.fromISO(data.startDateTime, { setZone: true });
            this.endDateTime = DateTime.fromISO(data.endDateTime, { setZone: true });
            this.instructions = data.instructions;
        }
        else
        {
            this.price = { currencyCode: "DKK" };
        }
    }

    /**
     * The ID of the route template.
     */
    public readonly id: string;

    /**
     * The reference to use for routes based on this template.
     */
    public readonly reference: string;

    /**
     * The consignor to use for routes based on this template.
     */
    public readonly consignor: Consignor;

    /**
     * The price, ex. VAT, to use for routes based on this template.
     */
    public price: Partial<ICurrencyValue>;

    /**
     * The date and time at which this template starts generating routes.
     */
    public readonly startDateTime: DateTime;

    /**
     * The date and time at which this template stops generating routes.
     */
    public readonly endDateTime: DateTime;

    /**
     * The time before a route starts, at which this template should generate the route.
     */
    public readonly routeCreationTime: Duration;

    /**
     * The instructions to use for routes based on this template.
     */
    public instructions: string | undefined;
}
