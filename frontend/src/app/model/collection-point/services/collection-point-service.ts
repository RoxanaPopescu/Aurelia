import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { CollectionPoint } from "../entities/collection-point";
import { Order } from "../entities/order";

/**
 * Represents a service that manages collection points.
 */
@autoinject
export class CollectionPointService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(apiClient: ApiClient)
    {
        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;

    /**
     * Gets the specified collection point.
     * @param id The ID identifying the collection point.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the collection point.
     */
    public async get(id: string, signal?: AbortSignal): Promise<CollectionPoint>
    {
        const result = await this._apiClient.get(`collection-points/${id}`,
        {
            signal
        });

        return new CollectionPoint(result.data);
    }

    /**
     * Creates a new collection point, associated with the organization.
     * @param collectionPoint The collection point to create.
     * @returns A promise that will be resolved with the new collection point.
     */
     public async create(collectionPoint: CollectionPoint): Promise<CollectionPoint>
     {
         const result = await this._apiClient.post("collection-points",
         {
             body: { collectionPoint }
         });

         return new CollectionPoint(result.data);
     }

    /**
     * Saves a deviation event for the specific order
     * @param order The order from the collection point.
     * @returns A promise that will be resolved when the event is on the queue.
     */
    public async saveDeviation(order: Order): Promise<void>
    {
        await this._apiClient.post(`collection-points/orders/${order.status.slug}`,
        {
            body:
            {
                orderId: order.id,
                collectionPointId: order.collectionPoint.id,
                description: order.deviationDescription,
                images: [],
                location: order.collectionPoint.location
            }
        });
    }

    /**
     * Saves a the order collected event
     * @param order The order from the collection point.
     * @returns A promise that will be resolved when the event is on the queue.
     */
    public async orderCollected(order: Order): Promise<void>
    {
        await this._apiClient.post("collection-points/orders/collected",
        {
            body:
            {
                orderId: order.id,
                collectionPointId: order.collectionPoint.id,
                description: order.deviationDescription,
                colli: order.colli,
                location: order.collectionPoint.location,
                externalOrderId: order.creatorOrderId
            }
        });
    }
}
