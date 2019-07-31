import { autoinject, bindable } from "aurelia-framework";
import { ExpressRouteService, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";
import { Workspace } from "../../services/workspace";

interface IExpressRouteStop
{
    type: "express-route-stop";
    stop: ExpressRouteStop;
    dragged?: boolean;
    dragstart?: boolean;
    routeSlug: string;
}

interface IDriverRouteStop
{
    type: "driver-route-stop";
    stop: DriverRouteStop;
    dragged?: boolean;
    dragstart?: boolean;
    dragover?: boolean;
}

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

    protected driverStops: (IExpressRouteStop | IDriverRouteStop)[];
    protected expressStops: IExpressRouteStop[];
    protected driverStopsDragover = false;
    protected expressStopsDragover = false;

    /**
     * Called by the framework when the component is attached to the DOM.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async attached(): Promise<void>
    {
        this.workspace.isMerging = true;

        const selectedDriverRoute = this.workspace.selectedDriverRoutes[0];

        this.driverStops = selectedDriverRoute.stops.map(stop => ({ type: "driver-route-stop", stop }));

        this.expressStops = [];

        for (const route of this.workspace.selectedExpressRoutes)
        {
            this.expressStops.push(...route.stops.map(stop => ({ type: "express-route-stop" as any, stop, routeSlug: route.slug })));
        }

        this.updateWorkspace();
    }

    /**
     * Called by the framework when the component is detached to the DOM.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async detached(): Promise<void>
    {
        // Clear state related to the merge.
        this.workspace.isMerging = false;
        this.workspace.newDriverStops = undefined;
        this.workspace.remainingExpressStops = undefined;
    }

    /**
     * Called when the user starts dragging an item.
     * @param event The drag event.
     * @param item The item being dragged.
     * @returns True to continue, false to prevent default.
     */
    protected onExpressStopsDragStart(event: DragEvent, stop: IExpressRouteStop): boolean
    {
        const payloadJson = JSON.stringify({ stopId: stop.stop.id });

        event.dataTransfer!.setData(`text/${stop.type}+json`, payloadJson);
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
    protected onExpressStopsDragEnd(event: DragEvent, stop: IExpressRouteStop): void
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
            event.dataTransfer!.types.includes("text/express-route-stop+json");

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
            event.dataTransfer!.getData("text/express-route-stop+json");

        const payloadData = JSON.parse(payloadJson);
        const draggedStop = this.removeStop(payloadData.stopId);

        this.expressStops.push(draggedStop as IExpressRouteStop);
        draggedStop.dragged = false;

        // TODO: Sort stops

        this.updateWorkspace();
    }

    /**
     * Called when the user starts dragging an item.
     * @param event The drag event.
     * @param item The item being dragged.
     * @returns True to continue, false to prevent default.
     */
    protected onDriverStopsDragStart(event: DragEvent, stop: IDriverRouteStop): boolean
    {
        const payloadJson = JSON.stringify({ stopId: stop.stop.id });

        event.dataTransfer!.setData(`text/${stop.type}+json`, payloadJson);
        event.dataTransfer!.dropEffect = "move";

        stop.dragstart = true;
        requestAnimationFrame(() =>
        {
            stop.dragstart = false;
            stop.dragged = true;
        });

        return true;
    }

    /**
     * Called when the user starts dragging an item.
     * @param event The drag event.
     * @param item The item being dragged.
     * @returns True to continue, false to prevent default.
     */
    protected onDriverStopsDragEnd(event: DragEvent, stop: IDriverRouteStop): void
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
    protected onDriverStopsDragOver(event: DragEvent, stop?: IDriverRouteStop): void
    {
        const allowDrop =
            event.dataTransfer!.types.includes("text/driver-route-stop+json") ||
            event.dataTransfer!.types.includes("text/express-route-stop+json");

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
    protected onDriverStopsDragLeave(event: DragEvent, stop?: IDriverRouteStop): void
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
    protected onDriverStopsDrop(event: DragEvent, stop?: IDriverRouteStop): void
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
            event.dataTransfer!.getData("text/express-route-stop+json") ||
            event.dataTransfer!.getData("text/driver-route-stop+json");

        const payloadData = JSON.parse(payloadJson);
        const draggedStop = this.removeStop(payloadData.stopId);

        const targetStopIndex = stop != null ? this.driverStops.findIndex(s => s === stop) : this.driverStops.length;
        this.driverStops.splice(targetStopIndex, 0, draggedStop);
        draggedStop.dragged = false;

        this.updateWorkspace();
    }

    /**
     * Removes the specified stop from the stop lists.
     * @param stopId The ID of the stop to remove.
     * @returns The stop that was removed.
     */
    private removeStop(stopId: string): (IExpressRouteStop | IDriverRouteStop)
    {
        let stop: any;
        let stopIndex: number;

        stopIndex = this.expressStops.findIndex(s => s.stop.id === stopId);

        if (stopIndex > -1)
        {
            stop = this.expressStops[stopIndex];
            this.expressStops.splice(stopIndex, 1);
        }

        stopIndex = this.driverStops.findIndex(s => s.stop.id === stopId);

        if (stopIndex > -1)
        {
            stop = this.driverStops[stopIndex];
            this.driverStops.splice(stopIndex, 1);
        }

        return stop;
    }

    private updateWorkspace(): void
    {
        // HACK: Force a full update of the map.

        this.workspace.newDriverStops = [];
        this.workspace.remainingExpressStops = [];

        setTimeout(() =>
        {
            let i = 0;

            this.workspace.newDriverStops = this.driverStops.map(stop =>
            {
                stop.stop.newStopNumber = ++i;

                return stop.stop;
            });

            const expressStopMap = new Map<string, ExpressRouteStop[]>();

            const sortedExpressStops = this.expressStops.slice().sort((a, b) => a.stop.stopNumber - b.stop.stopNumber);

            for (const stop of sortedExpressStops)
            {
                stop.stop.newStopNumber = undefined;

                const stops = expressStopMap.get(stop.routeSlug) || [];
                stops.push(stop.stop);
                expressStopMap.set(stop.routeSlug, stops);
            }

            this.workspace.remainingExpressStops = Array.from(expressStopMap.values());
        });
    }
}
