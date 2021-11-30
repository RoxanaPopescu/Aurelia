import { Route } from "app/model/route";
import { Shipment } from "app/model/shipment";

export class AutomaticDispatchJobResult
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.routes = data.routes.map((r: any) => {

            r.driver = { id: r.driverId, status: "approved", name: { first: r.driverName } };

            return new Route(r);
        });
        this.unscheduledShipments = data.unscheduledShipments.map((s: any) =>
        {
            return { shipment: new Shipment(s.shipment), reasons: s.reasons };
        });
    }

    /**
     * The status of the route plan.
     */
    public routes: Route[];

    /**
     * The shipments in this result
     */
    public unscheduledShipments: { shipment: Shipment; reasons: string[] }[];
}
