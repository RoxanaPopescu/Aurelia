import React from "react";
import { Route, Redirect } from "react-router";

import Localization from "shared/src/localization";
import TrackingRoute from "shared/src/components/tracking/route";
import RouteListComponent from "shared/src/components/routes/list";
import RouteDetailsComponent from "shared/src/components/routes/details";
import OrderListComponent from "shared/src/components/order/list";
import SaveOrderComponent from "shared/src/components/order/save";
import OrderDetailsComponent from "shared/src/components/order/details";
import OrderSettingsComponent from "shared/src/components/order/settings";
import LiveTrackingComponent from "shared/src/components/liveTracking";
import ProfileComponent from "shared/src/components/profile";
import DepartmentsListComponent from "shared/src/components/departments/list";
import AgreementsListComponent from "../components/agreements/list/index";
import FulfillersKpiComponent from "../components/kpi/fulfiller/fulfillers";
import ConsignorsKpiComponent from "../components/kpi/fulfiller/consignors";
import ConsignorKpiComponent from "../components/kpi/consignor";
import { Session } from "../model/session/session";
import { Consignor } from "../model/logistics/consignor";
import UserComponent from "../components/users/user";
import UserManagementComponent from "../components/users/management";
import CreateUserComponent from "../components/users/create";
import { Fulfiller } from "../model/logistics/fulfiller";
import AutoDispatchComponent from "fulfiller/src/components/routes/autoDispatch";
import DepartmentComponent from "../components/departments/department";

export type PageType =
  | "Orders"
  | "Routes"
  | "Profile"
  | "Users"
  | "Kpi"
  | "Departments"
  | "Agreements";

export class NavigationPage {
  static page(type: PageType): { text: string; url: string } {
    let items: { text: string; url: string }[] = [];

    let subPages = NavigationPage.subPages(type);
    for (let subPage of subPages) {
      let title = SubPage.title(subPage);
      if (title) {
        items.push({
          text: title,
          url: SubPage.path(subPage)
        });
      }
    }

    let page = {
      text: NavigationPage.title(type),
      url: NavigationPage.path(type),
      logo: NavigationPage.logo(type)
    };

    if (items.length > 0) {
      const key = "subPages";
      page[key] = items;
    }

    return page;
  }

  static routes(type: PageType): JSX.Element[] {
    let elements: JSX.Element[] = [];
    let subPages = NavigationPage.subPages(type);

    for (let subPage of subPages) {
      elements.push(
        <Route
          path={SubPage.path(subPage)}
          component={SubPage.component(subPage)}
          key={SubPage.path(subPage)}
        />
      );
      if (SubPage.path(subPage).indexOf("/list") > 0) {
        elements.push(
          <Redirect
            from={SubPage.path(subPage)}
            to={SubPage.path(subPage) + "/1"}
            key={"redirect_" + SubPage.path(subPage)}
          />
        );
      }
    }

    return elements;
  }

  static title(type: PageType): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case "Orders":
        return Localization.operationsValue("Menu_Orders");
      case "Routes":
        return Localization.operationsValue("Menu_Routes");
      case "Profile":
        return Localization.operationsValue("Menu_Profile");
      case "Users":
        return Localization.operationsValue("Menu_Users");
      case "Kpi":
        return Localization.operationsValue("Menu_Kpi");
      case "Departments":
        return Localization.operationsValue("Menu_Departments");
      case "Agreements":
        return Localization.operationsValue("Menu_Agreements");
    }
  }

  static path(type: PageType): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case "Orders":
        return "/orders";
      case "Routes":
        return "/routes";
      case "Profile":
        return "/profile";
      case "Users":
        return "/users";
      case "Kpi":
        return "/kpi";
      case "Departments":
        return "/departments";
      case "Agreements":
        return "/agreements";
    }
  }

  static logo(page: PageType) {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case "Orders":
        return "orders";
      case "Routes":
        return "routes";
      case "Profile":
        return "profile";
      case "Users":
        return "userManagement";
      case "Kpi":
        return "kpi";
      case "Departments":
        return "departments";
      case "Agreements":
        return "agreements";
    }
  }

  static subPages(type: PageType): SubPage[] {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case "Orders":
        return [
          SubPage.OrderList,
          SubPage.OrderCreate,
          SubPage.OrderUpdate,
          SubPage.OrderDetails,
          SubPage.OrderSettings
        ];
      case "Routes":
        return [
          SubPage.RouteList,
          SubPage.RouteLiveTracking,
          SubPage.DriverTracking,
          SubPage.RouteDetails,
          ...(Session.outfit instanceof Fulfiller
            ? [SubPage.FulfillerRouteAutoDispatch]
            : [])
        ];
      case "Profile":
        return [SubPage.Profile];
      case "Users":
        return [
          SubPage.UsersManagement,
          SubPage.UsersCreate,
          SubPage.UsersDetails
        ];
      case "Kpi":
        return Session.outfit instanceof Consignor
          ? [SubPage.ConsignorKpi]
          : [SubPage.FulfillerKpiFulfillers, SubPage.FulfillerKpiConsignors];
      case "Departments":
        return [
          SubPage.DepartmentsList,
          SubPage.DepartmentsCreate,
          SubPage.Department
        ];
      case "Agreements":
        return [SubPage.AgreementsList];
    }
  }
}

export enum SubPage {
  DriverTracking,
  RouteLiveTracking,
  RouteList,
  RouteDetails,
  FulfillerRouteAutoDispatch,

  OrderCreate,
  OrderList,
  OrderUpdate,
  OrderSettings,
  OrderDetails,

  UsersCreate,
  UsersManagement,
  UsersDetails,

  FulfillerKpiFulfillers,
  FulfillerKpiConsignors,
  ConsignorKpi,

  Profile,

  DepartmentsList,
  Department,
  DepartmentsCreate,

  AgreementsList
}

export namespace SubPage {
  export function title(page: SubPage): string | undefined {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case SubPage.RouteLiveTracking:
        return Localization.operationsValue("Menu_Operation_LiveTracking");
      case SubPage.DriverTracking:
        return Localization.operationsValue("Menu_Operation_DriverTracking");
      case SubPage.RouteList:
        return Localization.operationsValue("Menu_Routes_List");
      case SubPage.RouteDetails:
        return undefined;
      case SubPage.FulfillerRouteAutoDispatch:
        return Localization.operationsValue("Menu_Routes_AutoDispatch");
      case SubPage.OrderCreate:
        return undefined; // return Localization.operationsValue("Menu_Order_Create");
      case SubPage.OrderUpdate:
        return undefined;
      case SubPage.OrderList:
        return Localization.operationsValue("Menu_Order_List");
      case SubPage.OrderSettings:
        return undefined; // Localization.operationsValue("Menu_Order_Settings");
      case SubPage.OrderDetails:
        return undefined;
      case SubPage.UsersCreate:
        return undefined; // return Localization.operationsValue("Menu_Users_Create");
      case SubPage.UsersManagement:
        return Localization.operationsValue("Menu_Users_Management");
      case SubPage.UsersDetails:
        return undefined;
      case SubPage.FulfillerKpiConsignors:
        return Localization.operationsValue("Menu_Kpi_Fulfiller:Consignors");
      case SubPage.FulfillerKpiFulfillers:
        return Localization.operationsValue("Menu_Kpi_Fulfiller:Fulfillers");
      case SubPage.ConsignorKpi:
        return Localization.operationsValue("Menu_Kpi_Consignor");
      case SubPage.Profile:
        return undefined;
      case SubPage.DepartmentsList:
        return Localization.operationsValue("Menu_Departments_List");
      case SubPage.Department:
        return undefined;
      case SubPage.DepartmentsCreate:
        return undefined; // return Localization.operationsValue("Menu_Departments_Create");
      case SubPage.AgreementsList:
        return Localization.operationsValue("Menu_Agreements_List");
    }
  }

  export function component(page: SubPage) {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case SubPage.RouteLiveTracking:
        return LiveTrackingComponent;
      case SubPage.DriverTracking:
        return TrackingRoute;
      case SubPage.RouteList:
        return RouteListComponent;
      case SubPage.RouteDetails:
        return RouteDetailsComponent;
      case SubPage.FulfillerRouteAutoDispatch:
        return AutoDispatchComponent;
      case SubPage.OrderCreate:
        return SaveOrderComponent;
      case SubPage.OrderUpdate:
        return SaveOrderComponent;
      case SubPage.OrderList:
        return OrderListComponent;
      case SubPage.OrderSettings:
        return OrderSettingsComponent;
      case SubPage.OrderDetails:
        return OrderDetailsComponent;
      case SubPage.Profile:
        return ProfileComponent;
      case SubPage.UsersCreate:
        return CreateUserComponent;
      case SubPage.UsersManagement:
        return UserManagementComponent;
      case SubPage.UsersDetails:
        return UserComponent;
      case SubPage.FulfillerKpiFulfillers:
        return FulfillersKpiComponent;
      case SubPage.FulfillerKpiConsignors:
        return ConsignorsKpiComponent;
      case SubPage.ConsignorKpi:
        return ConsignorKpiComponent;
      case SubPage.DepartmentsList:
        return DepartmentsListComponent;
      case SubPage.Department:
        return DepartmentComponent;
      case SubPage.DepartmentsCreate:
        return DepartmentComponent;
      case SubPage.AgreementsList:
        return AgreementsListComponent;
    }
  }

  export function path(page: SubPage): string {
    // tslint:disable-next-line:switch-default
    switch (page) {
      case SubPage.RouteLiveTracking:
        return NavigationPage.path("Routes") + "/live-tracking";
      case SubPage.DriverTracking:
        return NavigationPage.path("Routes") + "/driver-tracking";
      case SubPage.RouteList:
        return NavigationPage.path("Routes") + "/list";
      case SubPage.RouteDetails:
        return NavigationPage.path("Routes") + "/details/:id";
      case SubPage.FulfillerRouteAutoDispatch:
        return NavigationPage.path("Routes") + "/auto-dispatch";
      case SubPage.OrderCreate:
        return NavigationPage.path("Orders") + "/create";
      case SubPage.OrderUpdate:
        return NavigationPage.path("Orders") + "/edit/:id";
      case SubPage.OrderList:
        return NavigationPage.path("Orders") + "/list";
      case SubPage.OrderSettings:
        return NavigationPage.path("Orders") + "/settings";
      case SubPage.OrderDetails:
        return NavigationPage.path("Orders") + "/details/:id";
      case SubPage.Profile:
        return NavigationPage.path("Profile");
      case SubPage.UsersCreate:
        return NavigationPage.path("Users") + "/create";
      case SubPage.UsersManagement:
        return NavigationPage.path("Users") + "/management/:page";
      case SubPage.UsersDetails:
        return NavigationPage.path("Users") + "/details/:id";
      case SubPage.FulfillerKpiFulfillers:
        return NavigationPage.path("Kpi") + "/fulfillers";
      case SubPage.FulfillerKpiConsignors:
        return NavigationPage.path("Kpi") + "/consignors";
      case SubPage.ConsignorKpi:
        return NavigationPage.path("Kpi") + "/consignor";
      case SubPage.DepartmentsList:
        return NavigationPage.path("Departments") + "/list";
      case SubPage.Department:
        return NavigationPage.path("Departments") + "/:id";
      case SubPage.DepartmentsCreate:
        return NavigationPage.path("Departments") + "/create";
      case SubPage.AgreementsList:
        return NavigationPage.path("Agreements") + "/list";
    }
  }
}
