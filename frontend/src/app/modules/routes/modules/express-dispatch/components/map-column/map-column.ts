import { bindable } from "aurelia-framework";
import { Workspace } from "../../services/workspace";
import { DriverRoute, ExpressRoute, DriverRouteStop, ExpressRouteStop } from "app/model/express-route";

export class MapColumnCustomElement
{
    private _selectedFromStop: DriverRouteStop | ExpressRouteStop | undefined;

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

    protected onConnectedStopClick(stop: DriverRouteStop | ExpressRouteStop): void
    {
        if (this._selectedFromStop == null)
        {
            this._selectedFromStop = stop;

            return;
        }

        if (this._selectedFromStop.id === stop.id)
        {
            this._selectedFromStop = undefined;

            return;
        }

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

        this._selectedFromStop = undefined;
        this.workspace.newDriverStops = this.workspace.newDriverStops!.slice();

        this.updateMergeColumn();
    }

    protected onUnconnectedStopClick(stop: DriverRouteStop | ExpressRouteStop): void
    {
        if (this._selectedFromStop == null)
        {
            return;
        }

        const insertAfterIndex = this.workspace.newDriverStops!.findIndex(s => s.id === this._selectedFromStop!.id);
        const insertBeforeStop = this.workspace.newDriverStops![insertAfterIndex + 1];

        if (!this.validateDriverStopConnection(stop, insertBeforeStop))
        {
            this._selectedFromStop = undefined;

            return;
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

        this.workspace.newDriverStops!.splice(insertAfterIndex + 1, 0, stop);

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
        if (draggedStop!.type.slug === "pickup")
        {
            for (const orderId of draggedStop.orderIds)
            {
                const deliveryStop = this.workspace.newDriverStops!.find(s => s.type.slug === "delivery" && s.orderIds.includes(orderId));

                if (
                    (deliveryStop != null && targetStop == null) ||
                    (deliveryStop != null && targetStop != null && this.workspace.newDriverStops!.indexOf(deliveryStop) < this.workspace.newDriverStops!.indexOf(targetStop)))
                {
                    return false;
                }
            }
        }
        else
        {
            for (const orderId of draggedStop.orderIds)
            {
                const pickupStop = this.workspace.newDriverStops!.find(s => s.type.slug === "pickup" && s.orderIds.includes(orderId));

                if (
                    (pickupStop == null) ||
                    (targetStop != null && this.workspace.newDriverStops!.indexOf(pickupStop) >= this.workspace.newDriverStops!.indexOf(targetStop)))
                {
                    return false;
                }
            }
        }

        return true;
    }
}
