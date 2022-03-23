import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { ApiResult } from "../../../../shared/infrastructure/api-client/api-result";

/**
 * Represents a service that manages import of files.
 */
@autoinject
export class ImportService
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
     * Gets the specified order.
     * @param fileId The ID associated with the file.
     * @param consignorId The ID of the consignor who should be associated with the orders.
     * @returns A promise that will be resolved with the order.
     */
    public async createOrdersFromFile(fileId: string, consignorId: string): Promise<ApiResult>
    {
        const result = await this._apiClient.post("orders/upload",
        {
            query: { uuid: fileId, consignorId: consignorId }
        });

        return result;
    }

    /**
     * Gets the specified order.
     * @param file The file.
     * @returns A promise that will be resolved with the order.
     */
    public async uploadFile(file: File): Promise<void>
    {
        await this._apiClient.post("upload/excel",
        {
            query: { file: file }
        });
    }
}
