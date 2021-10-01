import { autoinject, bindable } from "aurelia-framework";
import { AbortError } from "shared/types";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { ExpressRouteService, DriverRouteStop, ExpressRouteStop, ExpressRoute } from "app/model/express-route";
import { Workspace } from "../../services/workspace";

interface IExpressRouteStop
{
    type: "express-route-stop";
    stop: ExpressRouteStop;
    dragged?: boolean;
    dragstart?: boolean;
    route: ExpressRoute;
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

    private readonly _expressRouteService: ExpressRouteService;
    private _draggedStop: IDriverRouteStop | IExpressRouteStop | undefined;

    protected driverStopsElement: HTMLElement;

    protected driverStops: (IExpressRouteStop | IDriverRouteStop)[];
    protected get driverStopsFiltered(): (IExpressRouteStop | IDriverRouteStop)[] | undefined {
        if (this.driverStops == null)
        {
            return undefined;
        }

        return this.driverStops.filter(s => s.stop.status.slug !== "cancelled");
    }

    protected expressStops: IExpressRouteStop[];
    protected driverStopsDragover = false;
    protected expressStopsDragover = false;
    protected updateOperation: Operation;
    protected canApply = false;
    protected fetchingEstimate = false;
    protected addingStops = false;
    protected isDragging = false;

    /**
     * The workspace.
     */
    @bindable
    public workspace: Workspace;

    public updateFromWorkspace(): void
    {
        this.driverStops = this.workspace.newDriverStops!.map(stop =>
        {
            if (stop instanceof ExpressRouteStop)
            {
                return { type: "express-route-stop", stop, route: stop.route };
            }

            return { type: "driver-route-stop", stop };
        });

        this.expressStops = this.workspace.remainingExpressStops!
            .reduce((p, c) =>
            {
                p.push(...c);

                return p;
            }, [])
            .map(stop => ({ type: "express-route-stop", stop, route: stop.route }));

        this.updateWorkspace();
    }

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        const selectedDriverRoute = this.workspace.selectedDriverRoutes[0];

        this.driverStops = selectedDriverRoute.stops.map(stop => ({ type: "driver-route-stop", stop }));

        this.expressStops = [];

        for (const route of this.workspace.selectedExpressRoutes)
        {
            this.expressStops.push(...route.stops.map(stop => ({ type: "express-route-stop" as any, stop, route })));
        }

        if (this.driverStops.length === 0)
        {
            this.driverStops = this.expressStops;
            this.expressStops = [];
        }

        this.updateWorkspace();
    }

    /**
     * Called by the framework when the component is detached to the DOM.
     */
    public detached(): void
    {
        // Clear state related to the merge.
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
        this.driverStopsElement.style.height = `${this.driverStopsElement.offsetHeight}px`;
        this._draggedStop = stop;

        const payloadJson = JSON.stringify({ stopId: stop.stop.id });

        event.dataTransfer!.setData(`text/${stop.type}+json`, payloadJson);
        event.dataTransfer!.dropEffect = "move";

        this.isDragging = true;
        requestAnimationFrame(() => stop.dragged = true);

        return true;
    }

    /**
     * Called when the user is done dragging an item.
     * @param event The drag event.
     * @param item The item being dragged.
     * @returns True to continue, false to prevent default.
     */
    protected onExpressStopsDragEnd(event: DragEvent, stop: IExpressRouteStop): void
    {
        requestAnimationFrame(() =>
        {
            stop.dragged = false;
            this.isDragging = false;
            this.driverStopsElement.style.height = "";
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
        this.isDragging = false;
        this.driverStopsElement.style.height = "";

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
        this.driverStopsElement.style.height = `${this.driverStopsElement.offsetHeight}px`;
        this._draggedStop = stop;

        const payloadJson = JSON.stringify({ stopId: stop.stop.id });

        event.dataTransfer!.setData(`text/${stop.type}+json`, payloadJson);
        event.dataTransfer!.dropEffect = "move";

        this.isDragging = true;
        stop.dragstart = true;
        requestAnimationFrame(() =>
        {
            stop.dragstart = false;
            stop.dragged = true;
        });

        return true;
    }

    /**
     * Called when the user is done dragging an item.
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
            this.isDragging = false;
            this.driverStopsElement.style.height = "";
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
            (event.dataTransfer!.types.includes("text/driver-route-stop+json") ||
            event.dataTransfer!.types.includes("text/express-route-stop+json")) &&
            this.validateDriverStopDrop(stop);

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
        this.isDragging = false;
        this.driverStopsElement.style.height = "";

        this.updateWorkspace();
    }

    protected async onApplyClick(): Promise<void>
    {
        if (!this.canApply)
        {
            return;
        }

        this.canApply = false;

        try
        {
            this.workspace.isBusy = true;
            this.addingStops = true;

            const expressStops = this.driverStops.filter(s => s.type === "express-route-stop") as IExpressRouteStop[];
            const addRouteIds = [...new Set(expressStops.map(s => s.route.id))];

            await this._expressRouteService.updateDriverRoute(
                this.workspace.selectedDriverRoutes[0].routeId,
                this.driverStops.map(s => s.stop.id),
                addRouteIds);

            this.workspace.selectedDriverRoutes[0].selected = false;
            this.workspace.selectedDriverRoutes.splice(0, 1);

            this.canApply = true;
            this.addingStops = false;
            history.back();
        }
        catch (error)
        {
            Log.error("Could not save driver route changes", error);
        }
        finally
        {
            this.canApply = true;
            this.addingStops = false;
            this.workspace.isBusy = false;
        }
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

    private validateDriverStopDrop(targetStop?: IDriverRouteStop | IExpressRouteStop): boolean
    {
        if (this._draggedStop!.stop.type.slug === "pickup")
        {
            const firstDeliveryStop = this.driverStops.find(s => s.stop.type.slug === "delivery" && s.stop.route.slug === this._draggedStop!.stop.route.slug);

            if (
                (firstDeliveryStop != null && targetStop == null) ||
                (firstDeliveryStop != null && targetStop != null && this.driverStops.indexOf(firstDeliveryStop) < this.driverStops.indexOf(targetStop)))
            {
                return false;
            }
        }
        else
        {
            const firstPickupStop = this.driverStops.find(s => s.stop.type.slug === "pickup" && s.stop.route.slug === this._draggedStop!.stop.route.slug);

            if (
                (firstPickupStop == null) ||
                (targetStop != null && this.driverStops.indexOf(firstPickupStop) >= this.driverStops.indexOf(targetStop)))
            {
                return false;
            }
        }

        return true;
    }

    private updateWorkspace(): void
    {
        this.canApply = this.expressStops.length === 0;

        // Abort any existing update operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        // Create and execute the new update operation.
        this.updateOperation = new Operation(async signal =>
        {
            await this.updateEstimates(signal);

            // HACK: Force a full update of the map.
            this.workspace.newDriverStops = [...this.workspace.newDriverStops!];
            this.workspace.remainingExpressStops = [...this.workspace.remainingExpressStops!];
        });

        // Sort the express stops.
        this.expressStops.sort((a, b) =>
        {
            if (a.stop.orderIds[0] < b.stop.orderIds[0]) { return -1; }
            if (a.stop.orderIds[0] > b.stop.orderIds[0]) { return 1; }

            if (a.stop.stopNumber < b.stop.stopNumber) { return -1; }
            if (a.stop.stopNumber > b.stop.stopNumber) { return 1; }

            return 0;
        });

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

            const stops = expressStopMap.get(stop.route.slug) || [];
            stops.push(stop.stop);
            expressStopMap.set(stop.route.slug, stops);
        }

        this.workspace.remainingExpressStops = Array.from(expressStopMap.values());
    }

    private async updateEstimates(signal: AbortSignal): Promise<void>
    {
        for (const stop of this.driverStops)
        {
            stop.stop.estimates = undefined;
        }

        if (this.workspace.newDriverStops != null)
        {
            for (const stop of this.workspace.newDriverStops)
            {
                stop.estimates = undefined;
            }
        }

        try
        {
            this.fetchingEstimate = true;

            const expressStops = this.driverStops.filter(s => s.type === "express-route-stop") as IExpressRouteStop[];
            const addRouteIds = [...new Set(expressStops.map(s => s.route.id))];

            const estimatedDriverRoute = await this._expressRouteService.estimateDriverRoute(
                this.workspace.selectedDriverRoutes[0].routeId,
                this.driverStops.map(s => s.stop.id),
                addRouteIds,
                signal);

            for (const estimatedStop of estimatedDriverRoute.stops)
            {
                const stop = this.driverStops.find(s => s.stop.id === estimatedStop.id);

                if (stop != null)
                {
                    stop.stop.estimates = estimatedStop.estimates;
                }
            }

            this.fetchingEstimate = false;

            if (!this.addingStops)
            {
                this.canApply = this.expressStops.length === 0;
            }
        }
        catch (error)
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not re-estimate route", error);
            }
        }
    }
}
