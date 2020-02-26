import Base from "../../../services/base";
import { RouteListResponseModel } from "./models/responseModel";
import { RouteStatus } from "../../../model/logistics/routes";
import Localization from "../../../localization";
import { SortingDirectionMap, SortingDirection } from "shared/src/model/general/sorting";

export default class RouteService {
  static async getRoutes(
    page: number,
    pageSize: number,
    filter: string[],
    status: RouteStatus,
    sorting?: RoutesListSorting
  ) {
    // tslint:disable-next-line:no-any
    let items: { [Key: string]: any } = {
      page: page,
      pageSize: pageSize,
      filter: filter,
      status: [status.value]
    };

    if (sorting !== undefined) {
      items.sorting = [
        {
          field: new RoutesListSortingMap(sorting.key).id,
          direction: new SortingDirectionMap(sorting.direction).id
        }
      ];
    }

    let response = await fetch(
      Base.url("routes/list"),
      Base.defaultConfig(items)
    );

    if (response.ok) {
      let responseJson = await response.json();
      return new RouteListResponseModel(responseJson);
    }

    throw new Error(Localization.sharedValue("Error_General"));
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
