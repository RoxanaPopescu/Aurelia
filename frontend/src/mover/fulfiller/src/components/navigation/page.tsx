import React from "react";
import { Route } from "react-router";
import RoutePlansComponent from "../routePlanning/list";
import RoutePlanningDetails from "../routePlanning/details";
import Localization from "shared/src/localization";
import { Base } from "shared/src/webKit/utillity/base";
import DriverListComponent from "../fleet/drivers/list";
import DepotsDetailsComponent from "../depots/details";
import DepotsListComponent from "../depots/list";
import RoutePlanningSettingDetailsComponent from "../routePlanning/settings/details";
import OrderGroupListComponent from "fulfiller/src/components/orderGroup/list";
import OrderGroupComponent from "../orderGroup/single/index";
import DriverComponent from "../fleet/drivers/driver";
import CommunicationConsignorComponent from "../communication/consignor";
import RoutePlanSettingListComponent from "../routePlanning/settings/list";
import RoutePlanSettingDetailsComponent from "../routePlanning/settings/details";
import SimulationListComponent from "../routePlanning/simulation/components/list";
import SimulationStartComponent from "../routePlanning/simulation/components/start";
import SimulationResultComponent from "../routePlanning/simulation/components/result";
import DriverDispositionComponent from "../fleet/driverDispatch";

export type FulfillerPageType =
  | "RoutePlanning"
  | "Depots"
  | "FleetManagement"
  | "Communication";

export class FulfillerNavigationPage {
  // tslint:disable-next-line:no-any
  static page(type: FulfillerPageType): any {
    // tslint:disable-next-line:no-any
    let items: any[] = [];

    let subPages = FulfillerNavigationPage.subPages(type);
    for (let subPage of subPages) {
      let title = FulfillerSubPage.title(subPage);
      if (title && FulfillerSubPage.enabled(subPage)) {
        items.push({
          text: title,
          url: FulfillerSubPage.path(subPage)
        });
      }
    }

    let page = {
      text: FulfillerNavigationPage.title(type),
      url: FulfillerNavigationPage.path(type),
      logo: FulfillerNavigationPage.logo(type)
    };

    if (items.length > 0) {
      const key = "subPages";
      page[key] = items;
    }

    return page;
  }

  static routes(type: FulfillerPageType): JSX.Element[] {
    let elements: JSX.Element[] = [];
    let subPages = FulfillerNavigationPage.subPages(type);

    for (let subPage of subPages) {
      elements.push(
        <Route
          path={FulfillerSubPage.path(subPage)}
          component={FulfillerSubPage.component(subPage)}
          key={FulfillerSubPage.path(subPage)}
        />
      );
    }

    return elements;
  }

  static title(type: FulfillerPageType): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case "RoutePlanning":
        return Localization.operationsValue("Menu_RoutePlanning");
      case "Depots":
        return Localization.operationsValue("Menu_Depots");
      case "FleetManagement":
        return Localization.operationsValue("Menu_FleetManagement");
      case "Communication":
        return Localization.operationsValue("Menu_Communication");
    }
  }

  static path(page: FulfillerPageType): string {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case "RoutePlanning":
        return "/route-planning";
      case "Depots":
        return "/depots";
      case "FleetManagement":
        return "/fleet-management";
      case "Communication":
        return "/communication";
    }
  }

  static logo(page: FulfillerPageType) {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case "RoutePlanning":
        return "routePlanning";
      case "Depots":
        return "depots";
      case "FleetManagement":
        return "fleetManagement";
      case "Communication":
        return "communication";
    }
  }

  static subPages(type: FulfillerPageType): FulfillerSubPage[] {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case "RoutePlanning":
        return [
          FulfillerSubPage.RoutePlanningList,
          FulfillerSubPage.RoutePlanningDetails,
          FulfillerSubPage.RoutePlanningSettingList,
          FulfillerSubPage.RoutePlanningSettingDetails,
          FulfillerSubPage.RoutePlanningSettingCreate,
          FulfillerSubPage.OrderGroupList,
          FulfillerSubPage.OrderGroupCreate,
          FulfillerSubPage.OrderGroupDetails,
          FulfillerSubPage.SimulationList,
          FulfillerSubPage.SimulationStart,
          FulfillerSubPage.SimulationResult
        ];
      case "Depots":
        return [
          FulfillerSubPage.DepotList,
          FulfillerSubPage.DepotCreate,
          FulfillerSubPage.DepotDetails
        ];
      case "FleetManagement":
        return [
          FulfillerSubPage.DriverDisposition,
          FulfillerSubPage.DriverList,
          FulfillerSubPage.DriverCreate,
          FulfillerSubPage.DriverEdit
        ];
      case "Communication":
        return [FulfillerSubPage.CommunicationConsignor];
    }
  }
}

export enum FulfillerSubPage {
  RoutePlanningSettingList,
  RoutePlanningSettingDetails,
  RoutePlanningSettingCreate,
  RoutePlanningList,
  RoutePlanningDetails,
  OrderGroupList,
  OrderGroupCreate,
  OrderGroupDetails,
  SimulationList,
  SimulationStart,
  SimulationResult,
  DepotList,
  DepotCreate,
  DepotDetails,
  DriverDisposition,
  DriverList,
  DriverCreate,
  DriverEdit,
  CommunicationConsignor
}

export namespace FulfillerSubPage {
  export function enabled(page: FulfillerSubPage): boolean {
    if (
      Base.isProduction &&
      (page === FulfillerSubPage.OrderGroupList ||
        page === FulfillerSubPage.OrderGroupDetails ||
        page === FulfillerSubPage.OrderGroupCreate)
    ) {
      return false;
    }

    return true;
  }

  export function title(page: FulfillerSubPage): string | undefined {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case FulfillerSubPage.RoutePlanningList:
        return Localization.operationsValue("Menu_RoutePlanning_List");
      case FulfillerSubPage.RoutePlanningSettingList:
        return Localization.operationsValue("Menu_RoutePlanning_Settings");
      case FulfillerSubPage.RoutePlanningSettingCreate:
        return undefined; // return Localization.operationsValue("Menu_RoutePlanning_Settings_Create");
      case FulfillerSubPage.RoutePlanningSettingDetails:
        return undefined;
      case FulfillerSubPage.RoutePlanningDetails:
        return undefined;
      case FulfillerSubPage.OrderGroupList:
        return Localization.operationsValue("Menu_OrderGroup_List");
      case FulfillerSubPage.OrderGroupCreate:
        return undefined; // return Localization.operationsValue("Menu_OrderGroup_Create");
      case FulfillerSubPage.OrderGroupDetails:
        return undefined;
      case FulfillerSubPage.SimulationList:
        return Localization.operationsValue("Menu_Simulation_List");
      case FulfillerSubPage.SimulationStart:
        return undefined;
      case FulfillerSubPage.SimulationResult:
        return undefined;
      case FulfillerSubPage.DepotList:
        return Localization.operationsValue("Menu_RoutePlanning_Depots_List");
      case FulfillerSubPage.DepotCreate:
        return undefined; // return Localization.operationsValue("Menu_RoutePlanning_Depots_Create");
      case FulfillerSubPage.DepotDetails:
        return undefined;
      case FulfillerSubPage.DriverDisposition:
        return Localization.operationsValue("Menu_Driver_Disposition");
      case FulfillerSubPage.DriverList:
        return Localization.operationsValue("Menu_Driver_List");
      case FulfillerSubPage.DriverCreate:
        return undefined; // return Localization.operationsValue("Menu_Driver_Create");
      case FulfillerSubPage.DriverEdit:
        return undefined;
      case FulfillerSubPage.CommunicationConsignor:
        return Localization.operationsValue("Menu_Communication_Consignor");
    }
  }

  export function component(page: FulfillerSubPage) {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case FulfillerSubPage.RoutePlanningList:
        return RoutePlansComponent;
      case FulfillerSubPage.RoutePlanningSettingList:
        return RoutePlanSettingListComponent;
      case FulfillerSubPage.RoutePlanningSettingDetails:
        return RoutePlanSettingDetailsComponent;
      case FulfillerSubPage.RoutePlanningSettingCreate:
        return RoutePlanSettingDetailsComponent;
      case FulfillerSubPage.RoutePlanningSettingList:
        return RoutePlanningSettingDetailsComponent;
      case FulfillerSubPage.RoutePlanningDetails:
        return RoutePlanningDetails;
      case FulfillerSubPage.OrderGroupList:
        return OrderGroupListComponent;
      case FulfillerSubPage.OrderGroupCreate:
        return OrderGroupComponent;
      case FulfillerSubPage.OrderGroupDetails:
        return OrderGroupComponent;
      case FulfillerSubPage.SimulationList:
        return SimulationListComponent;
      case FulfillerSubPage.SimulationStart:
        return SimulationStartComponent;
      case FulfillerSubPage.SimulationResult:
        return SimulationResultComponent;
      case FulfillerSubPage.DepotList:
        return DepotsListComponent;
      case FulfillerSubPage.DepotCreate:
        return DepotsDetailsComponent;
      case FulfillerSubPage.DepotDetails:
        return DepotsDetailsComponent;
      case FulfillerSubPage.DriverDisposition:
        return DriverDispositionComponent;
      case FulfillerSubPage.DriverList:
        return DriverListComponent;
      case FulfillerSubPage.DriverCreate:
        return DriverComponent;
      case FulfillerSubPage.DriverEdit:
        return DriverComponent;
      case FulfillerSubPage.CommunicationConsignor:
        return CommunicationConsignorComponent;
    }
  }

  export function path(page: FulfillerSubPage): string {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case FulfillerSubPage.RoutePlanningList:
        return FulfillerNavigationPage.path("RoutePlanning") + "/list";
      case FulfillerSubPage.RoutePlanningSettingList:
        return FulfillerNavigationPage.path("RoutePlanning") + "/settings/list";
      case FulfillerSubPage.RoutePlanningSettingDetails:
        return (
          FulfillerNavigationPage.path("RoutePlanning") +
          "/settings/details/:id"
        );
      case FulfillerSubPage.RoutePlanningSettingCreate:
        return (
          FulfillerNavigationPage.path("RoutePlanning") + "/settings/create"
        );
      case FulfillerSubPage.RoutePlanningDetails:
        return FulfillerNavigationPage.path("RoutePlanning") + "/details/:id";
      case FulfillerSubPage.OrderGroupList:
        return (
          FulfillerNavigationPage.path("RoutePlanning") + "/order-groups/list"
        );
      case FulfillerSubPage.OrderGroupCreate:
        return (
          FulfillerNavigationPage.path("RoutePlanning") + "/order-groups/create"
        );
      case FulfillerSubPage.OrderGroupDetails:
        return (
          FulfillerNavigationPage.path("RoutePlanning") +
          "/order-groups/details/:id"
        );
      case FulfillerSubPage.SimulationList:
        return (
          FulfillerNavigationPage.path("RoutePlanning") + "/simulations/list"
        );
      case FulfillerSubPage.SimulationStart:
        return (
          FulfillerNavigationPage.path("RoutePlanning") +
          "/simulations/start/:id"
        );
      case FulfillerSubPage.SimulationResult:
        return (
          FulfillerNavigationPage.path("RoutePlanning") +
          "/simulations/:id/result"
        );
      case FulfillerSubPage.DepotList:
        return FulfillerNavigationPage.path("Depots") + "/list";
      case FulfillerSubPage.DepotCreate:
        return FulfillerNavigationPage.path("Depots") + "/create";
      case FulfillerSubPage.DepotDetails:
        return FulfillerNavigationPage.path("Depots") + "/details/:id";
      case FulfillerSubPage.DriverDisposition:
        return (
          FulfillerNavigationPage.path("FleetManagement") +
          "/driver-disposition"
        );
      case FulfillerSubPage.DriverList:
        return FulfillerNavigationPage.path("FleetManagement") + "/driver-list";
      case FulfillerSubPage.DriverCreate:
        return (
          FulfillerNavigationPage.path("FleetManagement") + "/drivers/create"
        );
      case FulfillerSubPage.DriverEdit:
        return (
          FulfillerNavigationPage.path("FleetManagement") + "/drivers/edit/:id"
        );
      case FulfillerSubPage.CommunicationConsignor:
        return FulfillerNavigationPage.path("Communication") + "/consignor";
    }
  }
}
