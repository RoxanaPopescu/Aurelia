import { Route } from "app/model/route";
import { Shipment } from "app/model/shipment";

export class AutomaticDispatchJobResult {
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.routes = data.routes.map(r => new Route(r));
        this.shipments = data.shipments.map((s: any) => { new Shipment(s), s.reasons });
    }

    /**
     * The status of the route plan.
     */
    public routes: Route[];

    /**
     * The shipments in this result
     */
    public shipments: { shipment: Shipment, reasons: string[] }[];
}
