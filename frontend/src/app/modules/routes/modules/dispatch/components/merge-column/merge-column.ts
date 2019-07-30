import { autoinject, bindable } from "aurelia-framework";
import { ExpressRouteService, DriverRouteStop } from "app/model/express-route";
import { Workspace } from "../../services/workspace";

@autoinject
export class MergeColumnCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `ExpressRouteService` instance.
     */
    public constructor(routeService: ExpressRouteService)
    {
        this._expressRouteService = routeService;
    }

    protected readonly _expressRouteService: ExpressRouteService;

    /**
     * The workspace.
     */
    @bindable
    protected workspace: Workspace;

    protected driverStops: DriverRouteStop[];
    protected expressStops: DriverRouteStop[];
    protected driverStopsDragover = false;
    protected expressStopsDragover = false;

    /**
     * Called by the framework when the component is attached to the DOM.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async attached(): Promise<void>
    {
        this.driverStops = this.workspace.selectedDriverRoutes[0].stops;
        this.expressStops = [];

        for (const route of this.workspace.selectedExpressRoutes)
        {
            this.expressStops.push(...route.stops);
        }
    }

    /**
     * Called when the user starts dragging an item.
     * @param event The drag event.
     * @param item The item being dragged.
     * @returns True to continue, false to prevent default.
     */
    protected onExpressStopsDragStart(event: DragEvent, stop: any): boolean
    {
        const payloadJson = JSON.stringify({ stopId: stop.id });
        const stopClassName = stop.constructor.name.toLowerCase();

        event.dataTransfer!.setData(`text/${stopClassName}+json`, payloadJson);
        event.dataTransfer!.dropEffect = "move";

        requestAnimationFrame(() => stop.dragged = true);

        return true;
    }

    /**
     * Called when the user starts dragging an item.
     * @param event The drag event.
     * @param item The item being dragged.
     * @returns True to continue, false to prevent default.
     */
    protected onExpressStopsDragEnd(event: DragEvent, stop?: any): void
    {
        requestAnimationFrame(() =>
        {
            stop.dragged = false;
        });
    }

    /**
     * Called when an item is being dragged over the element.
     * @param event The drag event.
     * @param item The item on which the even occurred.
     */
    protected onExpressStopsDragOver(event: DragEvent): void
    {
        const allowDrop =
            event.dataTransfer!.types.includes("text/expressroutestop+json");

        event.dataTransfer!.dropEffect = allowDrop ? "move" : "none";

        requestAnimationFrame(() =>
        {
            this.expressStopsDragover = event.dataTransfer!.dropEffect !== "none";
        });
    }

    /**
     * Called when an item that is being dragged leaves the element.
     * @param event The drag event.
     * @param item The item on which the even occurred.
     */
    protected onExpressStopsDragLeave(event: DragEvent): void
    {
        requestAnimationFrame(() =>
        {
            this.expressStopsDragover = false;
        });
    }

    /**
     * Called when an item is dropped on the element.
     * @param event The drag event.
     * @param item The item on which the even occurred.
     */
    protected onExpressStopsDrop(event: DragEvent): void
    {
        requestAnimationFrame(() =>
        {
            this.expressStopsDragover = false;
        });

        const payloadJson =
            event.dataTransfer!.getData("text/expressroutestop+json");

        const payloadData = JSON.parse(payloadJson);
        const draggedStop = this.removeStop(payloadData.stopId);

        this.expressStops.push(draggedStop);
        draggedStop.dragged = false;

        // TODO: Sort stops
    }

    /**
     * Called when the user starts dragging an item.
     * @param event The drag event.
     * @param item The item being dragged.
     * @returns True to continue, false to prevent default.
     */
    protected onDriverStopsDragStart(event: DragEvent, stop: any): boolean
    {
        const payloadJson = JSON.stringify({ stopId: stop.id });
        const stopClassName = stop.constructor.name.toLowerCase();

        event.dataTransfer!.setData(`text/${stopClassName}+json`, payloadJson);
        event.dataTransfer!.dropEffect = "move";

        requestAnimationFrame(() => stop.dragged = true);

        return true;
    }

    /**
     * Called when the user starts dragging an item.
     * @param event The drag event.
     * @param item The item being dragged.
     * @returns True to continue, false to prevent default.
     */
    protected onDriverStopsDragEnd(event: DragEvent, stop?: any): void
    {
        requestAnimationFrame(() =>
        {
            this.driverStopsDragover = false;
            stop.dragged = false;
        });
    }

    /**
     * Called when an item is being dragged over the element.
     * @param event The drag event.
     * @param item The item on which the even occurred.
     */
    protected onDriverStopsDragOver(event: DragEvent, stop?: any): void
    {
        const allowDrop =
            event.dataTransfer!.types.includes("text/driverroutestop+json") ||
            event.dataTransfer!.types.includes("text/expressroutestop+json");

        event.dataTransfer!.dropEffect = allowDrop ? "move" : "none";

        requestAnimationFrame(() =>
        {
            if (stop != null)
            {
                this.driverStopsDragover = false;
                stop.dragover = event.dataTransfer!.dropEffect !== "none";
            }
            else
            {
                this.driverStopsDragover = event.dataTransfer!.dropEffect !== "none";
            }
        });
    }

    /**
     * Called when an item that is being dragged leaves the element.
     * @param event The drag event.
     * @param item The item on which the even occurred.
     */
    protected onDriverStopsDragLeave(event: DragEvent, stop?: any): void
    {
        requestAnimationFrame(() =>
        {
            this.driverStopsDragover = false;

            if (stop != null)
            {
                stop.dragover = false;
            }
        });
    }

    /**
     * Called when an item is dropped on the element.
     * @param event The drag event.
     * @param item The item on which the even occurred.
     */
    protected onDriverStopsDrop(event: DragEvent, stop?: any): void
    {
        requestAnimationFrame(() =>
        {
            this.driverStopsDragover = false;

            if (stop != null)
            {
                stop.dragover = false;
            }
        });

        const payloadJson =
            event.dataTransfer!.getData("text/expressroutestop+json") ||
            event.dataTransfer!.getData("text/driverroutestop+json");

        const payloadData = JSON.parse(payloadJson);
        const draggedStop = this.removeStop(payloadData.stopId);

        const targetStopIndex = this.driverStops.findIndex(s => s === stop);
        this.driverStops.splice(targetStopIndex, 0, draggedStop);
        draggedStop.dragged = false;
    }

    /**
     * Removes the specified stop from the stop lists.
     * @param stopId The ID of the stop to remove.
     * @returns The stop that was removed.
     */
    private removeStop(stopId: string): any
    {
        let stop: any;
        let stopIndex: number;

        stopIndex = this.expressStops.findIndex(s => s.id === stopId);

        if (stopIndex > -1)
        {
            stop = this.expressStops[stopIndex];
            this.expressStops.splice(stopIndex, 1);
        }

        stopIndex = this.driverStops.findIndex(s => s.id === stopId);

        if (stopIndex > -1)
        {
            stop = this.driverStops[stopIndex];
            this.driverStops.splice(stopIndex, 1);
        }

        return stop;
    }
}
