import { DepotRouteRemark } from "../depotRouteRemark";

export const remarks = [
  new DepotRouteRemark({ code: 26, name: "Late release / pick of route" }),
  new DepotRouteRemark({ code: 31, name: "Late route consolidation" }),
  new DepotRouteRemark({ code: 32, name: "Late route not ready at ramp" }),
  new DepotRouteRemark({ code: 39, name: "Driver error (Fulfiller)" }),
  new DepotRouteRemark({ code: 61, name: "Route planning incorrect (Fulfiller)" }),
  new DepotRouteRemark({ code: 87, name: "IT system failure (Fulfiller)" }),
  new DepotRouteRemark({ code: 92, name: "Late arrival to ramp (Driver / Fulfiller)" }),
  new DepotRouteRemark({ code: 93, name: "Late departure from ramp (Driver / Fulfiller)" }),
  new DepotRouteRemark({ code: 96, name: "Change of fulfiller" }),
  new DepotRouteRemark({ code: 99, name: "Other reason that does not match codes above" })
];
