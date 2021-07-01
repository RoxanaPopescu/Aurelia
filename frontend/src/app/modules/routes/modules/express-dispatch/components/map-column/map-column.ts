import { bindable } from "aurelia-framework";
import { Workspace } from "../../services/workspace";
import { DriverRoute, ExpressRoute, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";

export class MapColumnCustomElement
{
    // Null means the driver.
    private _selectedFromStop: DriverRouteStop | ExpressRouteStop | null | undefined;

    /**
     * The workspace.
     */
    @bindable
    public workspace: Workspace;

    /**
     * Called when changes were made on the map, that requires the merge columns to update to match the workspace.
     */
    @bindable
    public updateMergeColumn: () => void;

    protected onDriverRouteClick(route: DriverRoute): void
    {
        route.selected = !route.selected;

        if (route.selected)
        {
            this.workspace.selectedDriverRoutes.push(route);
        }
        else
        {
            this.workspace.selectedDriverRoutes.splice(this.workspace.selectedDriverRoutes.findIndex(r => r.driver.id === route.driver.id), 1);
        }

        this.workspace.driverRoutes = this.workspace.driverRoutes.slice();
        this.workspace.selectedDriverRoutes = this.workspace.selectedDriverRoutes.slice();
    }

    protected onExpressRouteClick(route: ExpressRoute): void
    {
        route.selected = !route.selected;

        if (route.selected)
        {
            this.workspace.selectedExpressRoutes.push(route);
        }
        else
        {
            this.workspace.selectedExpressRoutes.splice(this.workspace.selectedExpressRoutes.findIndex(r => r.id === route.id), 1);
        }

        this.workspace.expressRoutes = this.workspace.expressRoutes.slice();
        this.workspace.selectedExpressRoutes = this.workspace.selectedExpressRoutes.slice();
    }

    protected onConnectedStopClick(stop: DriverRouteStop | ExpressRouteStop | null): void
    {
        if (stop == null || this._selectedFromStop === undefined)
        {
            this._selectedFromStop = stop;

            return;
        }

        if ((this._selectedFromStop == null && stop == null) || (this._selectedFromStop != null && stop != null && this._selectedFromStop.id === stop.id))
        {
            this._selectedFromStop = undefined;

            return;
        }

        if (this._selectedFromStop !== null)
        {
            const insertAfterIndex = this.workspace.newDriverStops!.findIndex(s => s.id === this._selectedFromStop!.id);
            const insertBeforeStop = this.workspace.newDriverStops![insertAfterIndex + 1];

            if (!this.validateDriverStopConnection(stop, insertBeforeStop))
            {
                this._selectedFromStop = undefined;

                return;
            }

            const movedStopIndex = this.workspace.newDriverStops!.findIndex(s => s.id === stop.id);

            this.workspace.newDriverStops!.splice(movedStopIndex, 1);
            this.workspace.newDriverStops!.splice(insertAfterIndex + 1, 0, stop);
        }
        else
        {
            const insertBeforeStop = this.workspace.newDriverStops![0];

            if (!this.validateDriverStopConnection(stop, insertBeforeStop))
            {
                this._selectedFromStop = undefined;

                return;
            }

            const movedStopIndex = this.workspace.newDriverStops!.findIndex(s => s.id === stop.id);

            this.workspace.newDriverStops!.splice(movedStopIndex, 1);
            this.workspace.newDriverStops!.unshift(stop);
        }

        this._selectedFromStop = undefined;
        this.workspace.newDriverStops = this.workspace.newDriverStops!.slice();

        this.updateMergeColumn();
    }

    protected onUnconnectedStopClick(stop: DriverRouteStop | ExpressRouteStop): void
    {
        if (this._selectedFromStop === undefined)
        {
            return;
        }

        let insertAfterIndex: number;

        if (this._selectedFromStop !== null)
        {
            insertAfterIndex = this.workspace.newDriverStops!.findIndex(s => s.id === this._selectedFromStop!.id);
            const insertBeforeStop = this.workspace.newDriverStops![insertAfterIndex + 1];

            if (!this.validateDriverStopConnection(stop, insertBeforeStop))
            {
                this._selectedFromStop = undefined;

                return;
            }
        }
        else
        {
            const insertBeforeStop = this.workspace.newDriverStops![0];

            if (!this.validateDriverStopConnection(stop, insertBeforeStop))
            {
                this._selectedFromStop = undefined;

                return;
            }
        }

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.workspace.remainingExpressStops!.length; i++)
        {
            const stopGroup = this.workspace.remainingExpressStops![i];

            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < stopGroup.length; j++)
            {
                if (stopGroup[j].id === stop.id)
                {
                    stopGroup.splice(j, 1);

                    if (stopGroup.length === 0)
                    {
                        this.workspace.remainingExpressStops!.splice(i, 1);
                    }
                }
            }
        }

        if (this._selectedFromStop !== null)
        {
            // tslint:disable-next-line: no-unnecessary-type-assertion
            this.workspace.newDriverStops!.splice(insertAfterIndex! + 1, 0, stop);
        }
        else
        {
            this.workspace.newDriverStops!.unshift(stop);
        }

        this._selectedFromStop = undefined;
        this.workspace.newDriverStops = this.workspace.newDriverStops!.slice();

        this.updateMergeColumn();
    }

    protected onMapClick(): void
    {
        this._selectedFromStop = undefined;
    }

    private validateDriverStopConnection(draggedStop: DriverRouteStop | ExpressRouteStop, targetStop: DriverRouteStop | ExpressRouteStop): boolean
    {
        if (draggedStop.type.slug === "pickup")
        {
            const firstDeliveryStop = this.workspace.newDriverStops!.find(s => s.type.slug === "delivery" && s.route.slug == draggedStop.route.slug);

            if (
                (firstDeliveryStop != null && targetStop == null) ||
                (firstDeliveryStop != null && targetStop != null && this.workspace.newDriverStops!.indexOf(firstDeliveryStop) < this.workspace.newDriverStops!.indexOf(targetStop)))
            {
                return false;
            }
        }
        else
        {
            const firstPickupStop = this.workspace.newDriverStops!.find(s => s.type.slug === "pickup" && s.route.slug == draggedStop.route.slug);

            if (
                (firstPickupStop == null) ||
                (targetStop != null && this.workspace.newDriverStops!.indexOf(firstPickupStop) >= this.workspace.newDriverStops!.indexOf(targetStop)))
            {
                return false;
            }
        }

        return true;
    }
}
