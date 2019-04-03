import { DepotRouteRemark } from "../depotRouteRemark";

export const remarks = [
  new DepotRouteRemark({ code: 26, name: "Sen frigivelse / pluk af rute (Coop)" }),
  new DepotRouteRemark({ code: 31, name: "Sen konsolidering af rute (Coop)" }),
  new DepotRouteRemark({ code: 32, name: "Sen rute ikke klar ved rampe (Coop)" }),
  new DepotRouteRemark({ code: 39, name: "Fejl fra chauffør (Mover)" }),
  new DepotRouteRemark({ code: 61, name: "Ruteplanlægning ikke korrekt (Mover)" }),
  new DepotRouteRemark({ code: 87, name: "It-systemfejl (Coop / Mover)" }),
  new DepotRouteRemark({ code: 92, name: "Sen ankomst til rampe (Chauffør / Mover)" }),
  new DepotRouteRemark({ code: 93, name: "Sen afgang fra rampe (Chauffør / Mover)" }),
  new DepotRouteRemark({ code: 96, name: "Skift af transportør (Ny chauffør / Mover)" }),
  new DepotRouteRemark({ code: 99, name: "Anden årsag matcher ikke koder ovenfor" })
];