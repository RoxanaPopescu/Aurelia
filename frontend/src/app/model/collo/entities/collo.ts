import { ColloStatus } from "./collo-status";
import { ColloOrigin } from "./collo-origin";
import { ColloScanMethod } from "./collo-scan-method";
import { Dimensions } from "app/model/shared";

/**
 * Represents a single collo.
 */
export class Collo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any, orderId: string)
    {
        this.id = data.id;
        this.orderId = orderId;
        this.orderSlug = data.orderSlug;
        this.consignorId = data.consignorId;
        this.barcode = data.barcode;
        this.tags = data.tags;
        this.status = new ColloStatus(data.status);
        this.origin = new ColloOrigin(data.origin);
        this.scanImageUrl = data.scanImageUrl;
        this.weight = data.weight;

        if (data.dimensions != null)
        {
            this.dimensions = new Dimensions(data.dimensions);
        }

        if (data.scanMethod != null)
        {
            this.scanMethod = new ColloScanMethod(data.scanMethod);
        }
    }

    /**
     * The ID of the collo.
     */
    public readonly id: string;

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
     * The tags associated with the collo, if any.
     */
    public readonly tags?: string[];

    /**
     * The weight of the collo in kg.
     */
    public readonly weight?: number;

    /**
     * The weight of the collo in kg.
     */
    public readonly dimensions?: Dimensions;

    /**
     * The status of the collo.
     */
    public status: ColloStatus;

    /**
     * The origin of the collo.
     */
    public readonly origin: ColloOrigin;

    /**
     * The method by which the collo was scanned.
     */
    public readonly scanMethod: ColloScanMethod;

    /**
     * The URL for the picture associated with the scanning of the collo, if any
     */
    public readonly scanImageUrl: string | undefined;
}
