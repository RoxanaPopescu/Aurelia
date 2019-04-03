import Base from "../../../services/base";
import { RoutesListSorting, RoutesListSortingMap } from "./store";
import { RouteListResponseModel } from "./models/responseModel";
import { RouteStatus } from "../../../model/logistics/routes";
import Localization from "../../../localization";
import { SortingDirectionMap } from "shared/src/model/general/sorting";

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
