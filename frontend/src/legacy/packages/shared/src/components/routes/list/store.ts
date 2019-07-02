import { observable, computed } from "mobx";
import { Route } from "./models/route";
import Localization from "../../../localization";
import { RouteStatus } from "shared/src/model/logistics/routes";
import { SortingDirection } from "shared/src/model/general/sorting";

export class RoutesListStore {
  @observable loading: boolean = true;
  @observable totalCount: number = 0;
  @observable error?: string;
  @observable routes?: Route[] = undefined;
  @observable searchQueries?: string;
  @observable routeStatusFilter: RouteStatus = new RouteStatus("requested");
  @observable pages: number = 20;
  @observable pageIndex: number = 0;
  @observable resultsPerPage: number = 40;
  @observable sorting = new RoutesListSorting("RouteId", "Descending");
  headers: { content: string; key: RoutesListSortingKey }[] = [
    {
      content: Localization.sharedValue("Route_TableHeader_Id"),
      key: "RouteId"
    },
    {
      content: Localization.sharedValue("Route_TableHeader_Reference"),
      key: "Reference"
    },
    {
      content: Localization.sharedValue("Route_TableHeader_Status"),
      key: "Status"
    },
    {
      content: Localization.sharedValue("Route_TableHeader_StartDate"),
      key: "StartDate"
    },
    {
      content: Localization.sharedValue("Route_TableHeader_StartAddress"),
      key: "StartAddress"
    },
    {
      content: Localization.sharedValue("Route_TableHeader_StopCount"),
      key: "StopCount"
    }
  ];

  @computed
  get routeCount(): number {
    return this.routes ? this.routes.length : 0;
  }

  @computed
  get empty(): boolean {
    if (this.routes === undefined || this.routes.length > 0) {
      return false;
    }

    return true;
  }

  clear() {
    this.routes = undefined;
    this.loading = true;
  }
}

export type RoutesListSortingKey =
  | "RouteId"
  | "Reference"
  | "Status"
  | "StartDate"
  | "StartAddress"
  | "StopCount";

export class RoutesListSortingMap {
  public static readonly map = {
    RouteId: {
      id: 1
    },
    Reference: {
      id: 2
    },
    StartAddress: {
      id: 3
    },
    StartDate: {
      id: 4
    },
    StopCount: {
      id: 5
    },
    Status: {
      id: 6
    }
  };

  public constructor(status: keyof typeof RoutesListSortingMap.map) {
    this.slug = status;
    Object.assign(this, RoutesListSortingMap.map[status]);
  }

  public slug: keyof typeof RoutesListSortingMap.map;
  public id: number;
}

export class RoutesListSorting {
  key: RoutesListSortingKey;
  direction: SortingDirection;

  constructor(key: RoutesListSortingKey, direction: SortingDirection) {
    this.key = key;
    this.direction = direction;
  }
}
