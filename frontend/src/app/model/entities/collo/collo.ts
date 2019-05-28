import { ColloStatus } from "./collo-status";
import { ColloOrigin } from "./collo-origin";

/**
 * Represents a single collo.
 */
export class Collo
{
    public constructor(data: any, orderId: string)
    {
        this.orderId = orderId;
        this.orderSlug = data.consignorOrderId;
        this.consignorId = data.consignorId;
        this.barcode = data.barcode;
        this.status = new ColloStatus(data.status);
        this.origin = new ColloOrigin(data.origin);
    }

    /**
     * The ID of the order to which the collo belongs.
     */
    public readonly orderId: string;

    /**
     * The slug identifying the order related to this collo.
     */
    public orderSlug: string;

    /**
     * The ID of the consignor related to this collo.
     */
    public consignorId: string;

    /**
     * The barcode identifying the collo.
     */
    public readonly barcode: string;

    /**
     * The status of the collo.
     */
    public readonly status: ColloStatus;

    /**
     * The origin of the collo.
     */
    public readonly origin: ColloOrigin;
}
