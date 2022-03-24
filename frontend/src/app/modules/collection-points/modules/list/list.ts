import { autoinject, observable } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { IScroll, ModalService } from "shared/framework";
import { CreateCollectionPointPanel } from "./modals/create-collection-point/create-collection-point";
import { CollectionPoint, CollectionPointService } from "app/model/collection-point";
import { IPaging } from "shared/types";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param collectionPointService The `CollectionPointService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(collectionPointService: CollectionPointService, modalService: ModalService)
    {
        this._collectionPointService = collectionPointService;
        this._modalService = modalService;
        this._constructed = true;
    }

    private readonly _collectionPointService: CollectionPointService;
    private readonly _modalService: ModalService;
    private readonly _constructed;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The text in the search text input.
     */
    @observable({ changeHandler: "update" })
    protected searchQuery: string | undefined;

    /**
     * The paging to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected paging: IPaging =
    {
        page: 1,
        pageSize: 30
    };

    /**
     * The items to present in the table.
     */
    protected results: CollectionPoint[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(): void
    {
        this.update();
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }
    }

    /**
     * Updates the page by fetching the latest data.
     */
    protected update(): void
    {
        // Return if the object is not constructed.
        // This is needed because the `observable` decorator calls the change handler when the
        // initial property value is set, which happens before the constructor is called.
        if (!this._constructed)
        {
            return;
        }

        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            // Fetch the data.
            const result = await this._collectionPointService.getAll(
                { searchQuery: this.searchQuery },
                { direction: "ascending", property: "name" },
                this.paging, signal
            );

            // Update the state.
            this.results = result;

            // Scroll to top.
            this.scroll?.reset();
        });
    }

    /**
     * Called when the `Add collection point` button is clicked.
     * Opens a modal for creating a collection point.
     */
    protected async onAddClick(): Promise<void>
    {
        const result = await this._modalService.open(CreateCollectionPointPanel).promise;

        if (result != null)
        {
            this.results.push(result);
        }

        this.update();
    }
}
