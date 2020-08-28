import { autoinject, observable } from "aurelia-framework";
import { OrderService } from "app/model/order";
import { Log } from "shared/infrastructure";
// const { ipcRenderer } = require('electron');

/**
 * Represents the module.
 */
@autoinject
export class DaoRelabelPage
{
    /**
     * Creates a new instance of the class.
     * @param orderService The `RouteService` instance.
     */
    public constructor(
        orderService: OrderService)
    {
        this._orderService = orderService;
    }

    private readonly _orderService: OrderService;

    /**
     * The barcode to relabel.
     */
    @observable({ changeHandler: "update" })
    protected barcode: string | undefined;

    /**
     * If a barcode is being loaded
     */
    protected loading = false;

    /**
     * Updates the page by fetching the latest data.
     */
    protected update(newValue?: string, oldValue?: string, propertyName?: string): void
    {
        if (newValue != null && newValue.length === 11) {
            this.getPdfLink(newValue);
        }
    }

    /**
     * Called when on search barcode is called
     */
    protected async onSearchBarcode(): Promise<void>
    {
        if (this.barcode != null) {
            this.getPdfLink(this.barcode);
        }
    }

    private async getPdfLink(barcode: string): Promise<void>
    {
        this.loading = true;

        try {
            const url = await this._orderService.getRelabelUrl(barcode);
            window.open(url,'_blank');

            // Send data to electron - we need to discuss how we do this
            /*
            const data = {
                url: url
            };

            ipcRenderer.send('print-pdf', data);
            */

            this.barcode = undefined;
        } catch (error) {
            Log.error("An error occurred while loading the barcode.\n", error);
        } finally {
            this.loading = false;
        }
    }
}
