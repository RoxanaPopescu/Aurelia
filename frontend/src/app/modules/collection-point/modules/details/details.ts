import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { AbortError } from "shared/types";
import { CollectionPoint, CollectionPointService } from "app/model/collection-point";

/**
 * Represents the route parameters for the page.
 */
interface ICollectionPointParams
{
    /**
     * The ID of the collection point.
     */
    id: string;
}

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    /**
     * Creates a new instance of the class.
     * @param collectionPointService The `CollectionPointService` instance.
     * @param router The `Router` instance.
     */
    public constructor(
        collectionPointService: CollectionPointService,
        router: Router)
    {
        this.collectionPointService = collectionPointService;
        this._router = router;
    }

    private readonly _router: Router;
    private _pollTimeout: any;
    protected readonly collectionPointService: CollectionPointService;

    /**
     * The id of the collection point
     */
    protected id: string;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The route to present.
     */
    protected collectionPoint: CollectionPoint | undefined;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: ICollectionPointParams): void
    {
        this.id = params.id;
        this.fetchDetails();
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        clearTimeout(this._pollTimeout);
    }

    /**
     * Fetches the specified collection point.
     * @param routeId The ID of the collection point to fetch.
     */
    private fetchDetails(): void
    {
        clearTimeout(this._pollTimeout);

        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        this.fetchOperation = new Operation(async signal =>
        {
            try
            {
                this.collectionPoint = await this.collectionPointService.get(this.id, signal);

                // this._router.title = this.route.slug;
                this._router.updateTitle();
            }
            catch (error)
            {
                // Only show error initially
                if (!(error instanceof AbortError) && this.collectionPoint == null)
                {
                    Log.error("An error occurred while loading this route.\n", error);
                }
            }
            finally
            {
                // Only update if in progress #FIXME: && this.collectionPoint.status.slug === "in-progress"
                if (this.collectionPoint != null)
                {
                    this._pollTimeout = setTimeout(() => this.fetchDetails(), 6000);
                }
            }
        });
    }
}
