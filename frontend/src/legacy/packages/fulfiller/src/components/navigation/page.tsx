import React from "react";
import { Route } from "react-router";
import RoutePlansComponent from "../routePlanning/list";
import RoutePlanningDetails from "../routePlanning/details-v1";
import Localization from "shared/src/localization";
import { Base } from "shared/src/webKit/utillity/base";
import DepotsDetailsComponent from "../depots/details";
import DepotsListComponent from "../depots/list";
import RoutePlanningSettingDetailsComponent from "../routePlanning/settings/details";
import OrderGroupListComponent from "fulfiller/src/components/orderGroup/list";
import OrderGroupComponent from "../orderGroup/single/index";
import RoutePlanSettingListComponent from "../routePlanning/settings/list";
import RoutePlanSettingDetailsComponent from "../routePlanning/settings/details";
import SimulationListComponent from "../routePlanning/simulation/components/list";
import SimulationStartComponent from "../routePlanning/simulation/components/start";
import SimulationResultComponent from "../routePlanning/simulation/components/result";
import DriverDispositionComponent from "../fleet/driverDispatch/dispatch";
import ForecastsComponent from "../fleet/driverDispatch/forecasts";
import CreatePrebookingComponent from "../fleet/driverDispatch/createPrebooking";
import AssignRoutesComponent from "../fleet/driverDispatch/assignRoutes";

export type FulfillerPageType =
  | "RoutePlanning"
  | "Depots"
  | "FleetManagement"

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
    }
  }

  static path(page: FulfillerPageType): string {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case "RoutePlanning":
        return "/route-planning";
      case "Depots":
        return "/distribution-centers";
      case "FleetManagement":
        return "/fleet-management";
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
          FulfillerSubPage.Forecasts,
          FulfillerSubPage.AssignRoutes,
          FulfillerSubPage.CreatePrebooking,
          FulfillerSubPage.DriverDispatch,
          FulfillerSubPage.DriverList,
          FulfillerSubPage.DriverCreate,
          FulfillerSubPage.DriverEdit
        ];
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
  Forecasts,
  AssignRoutes,
  CreatePrebooking,
  DriverDispatch,
  DriverList,
  DriverCreate,
  DriverEdit
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
      case FulfillerSubPage.CreatePrebooking:
        return undefined;
      case FulfillerSubPage.AssignRoutes:
        return undefined;
      case FulfillerSubPage.Forecasts:
        return "Forecasts";
      case FulfillerSubPage.DriverDispatch:
        return "Dispatch";
      case FulfillerSubPage.DriverList:
        return Localization.operationsValue("Menu_Driver_List");
      case FulfillerSubPage.DriverCreate:
        return undefined; // return Localization.operationsValue("Menu_Driver_Create");
      case FulfillerSubPage.DriverEdit:
        return undefined;
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
      case FulfillerSubPage.DriverDispatch:
        return DriverDispositionComponent;
      case FulfillerSubPage.CreatePrebooking:
        return CreatePrebookingComponent;
      case FulfillerSubPage.Forecasts:
        return ForecastsComponent;
      case FulfillerSubPage.AssignRoutes:
        return AssignRoutesComponent;
      case FulfillerSubPage.DriverList:
        return AssignRoutesComponent;
      case FulfillerSubPage.DriverCreate:
        return AssignRoutesComponent;
      case FulfillerSubPage.DriverEdit:
        return AssignRoutesComponent;
    }
  }

  export function path(page: FulfillerSubPage): string {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case FulfillerSubPage.RoutePlanningList:
        return FulfillerNavigationPage.path("RoutePlanning");
      case FulfillerSubPage.RoutePlanningSettingList:
        return FulfillerNavigationPage.path("RoutePlanning") + "/settings";
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
          FulfillerNavigationPage.path("RoutePlanning") + "/order-groups"
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
          FulfillerNavigationPage.path("RoutePlanning") + "/simulations"
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
        return FulfillerNavigationPage.path("Depots");
      case FulfillerSubPage.DepotCreate:
        return FulfillerNavigationPage.path("Depots") + "/create";
      case FulfillerSubPage.DepotDetails:
        return FulfillerNavigationPage.path("Depots") + "/details/:id";
      case FulfillerSubPage.CreatePrebooking:
        return (
          FulfillerNavigationPage.path("FleetManagement") +
          "/create-prebooking/:id"
        );
      case FulfillerSubPage.AssignRoutes:
        return (
          FulfillerNavigationPage.path("FleetManagement") +
          "/assign-routes/:origin/:ids"
        );
      case FulfillerSubPage.Forecasts:
        return FulfillerNavigationPage.path("FleetManagement") + "/forecasts";
      case FulfillerSubPage.DriverDispatch:
        return (
          FulfillerNavigationPage.path("FleetManagement") + "/dispatch/:state"
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
    }
  }
}
