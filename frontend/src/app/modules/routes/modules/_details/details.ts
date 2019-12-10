import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { AgreementService } from "app/model/agreement";
import { RouteService, Route } from "app/model/route";
import { AppRouter } from "aurelia-router";
import { ModalService } from "shared/framework";
import { DriverService } from "app/model/driver";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The ID of the route.
     */
    id?: string;
}

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param agreementService The `AgreementService` instance.
     * @param driverService The `DriverService` instance.
     * @param modalService The `ModalService` instance.
     * @param router The `AppRouter` instance.
     */
    public constructor(routeService: RouteService, agreementService: AgreementService, driverService: DriverService, modalService: ModalService, router: AppRouter)
    {
        this._routeService = routeService;
        this._agreementService = agreementService;
        this._driverService = driverService;
        this._modalService = modalService;
        this._router = router;
    }

    protected readonly _routeService: RouteService;
    protected readonly _agreementService: AgreementService;
    protected readonly _driverService: DriverService;
    protected readonly _modalService: ModalService;
    protected readonly _router: AppRouter;

    /**
     * The most recent update operation.
     */
    protected fetchOperation: Operation;

    /**
     * The route to present.
     */
    protected route: Route | undefined;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        // Create and execute the new operation.
        this.fetchOperation = new Operation(async signal =>
        {
            // Fetch the data.
            this.route = await this._routeService.get(params.id!, signal);
        });
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }
    }
}
