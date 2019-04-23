import React from "react";
import { observer } from "mobx-react";
import {
  PageHeader,
  TableComponent,
  ErrorInline,
  Button,
  ButtonType
} from "shared/src/webKit";
import Localization from "../../../localization";
import RouteService from "./service";
import {
  RoutesListStore,
  RoutesListSorting,
  RoutesListSortingKey
} from "./store";
import H from "history";
import { SubPage } from "shared/src/utillity/page";
import { debounce } from "throttle-debounce";
import { RouteStatus } from "shared/src/model/logistics/routes";
import { PageHeaderComponent } from "../../pageHeader";
import { PageContentComponent } from "../../pageContent";

interface Props {
  history?: H.History;
}

const store = new RoutesListStore();

@observer
export default class RouteListComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.sharedValue("Routes_List_Title");
    this.onSearchChange = debounce(300, false, this.onSearchChange);
  }

  private lastRequestId = 0;

  componentDidMount() {
    this.getPageFromUrl();
    window.addEventListener("popstate", this.onPopState);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.onPopState);
  }

  onPopState = (event: PopStateEvent) => {
    if (
      event.state != null &&
      event.state.stateGroup === "routes/list" &&
      event.state.pageIndex != null
    ) {
      this.setPageAndRefresh(event.state.pageIndex, event.state.query, false);
    } else {
      this.setPageAndRefresh(0, undefined, false);
    }
    // tslint:disable-next-line:semicolon
  };

  onSearchChange(query: string | undefined) {
    this.setPageAndRefresh(0, query, true);
  }

  getPageFromUrl() {
    let urlSegments = window.location.href.split("/");
    let page = parseInt(urlSegments[urlSegments.length - 1], 10);

    // Failsafe
    if (isNaN(page)) {
      page = 1;
    } else if (page >= store.pages) {
      page = 0;
    }
    store.pageIndex = page - 1;
    this.getRoutes();
  }

  getRoutes() {
    const requestId = ++this.lastRequestId;
    store.loading = true;
    store.error = undefined;

    var filters: string[] = [];
    if (store.searchQueries !== undefined) {
      filters = store.searchQueries.split(" ").filter(value => value !== "");
    }

    RouteService.getRoutes(
      store.pageIndex + 1,
      store.resultsPerPage,
      filters,
      store.routeStatusFilter,
      store.sorting
    )
      .then(response => {
        if (requestId !== this.lastRequestId) {
          return;
        }
        store.routes = response.routes;
        store.totalCount = response.totalCount;
        store.loading = false;
      })
      .catch(error => {
        if (requestId !== this.lastRequestId) {
          return;
        }
        store.error = error.message;
        store.routes = undefined;
        store.loading = false;
      });
  }

  sortData(sorting: RoutesListSorting) {
    store.sorting = sorting;
    this.getRoutes();
  }

  getRows() {
    let rows: string[][] = [];

    if (store.routes) {
      store.routes.map(route => {
        rows.push([
          route.id,
          route.reference || "",
          route.status.name,
          Localization.formatDateTime(route.startDateTime),
          route.startAddress.toString(),
          route.stopCount.toString()
        ]);
      });
    }

    return rows;
  }

  render() {
    if (store.error) {
      return (
        <ErrorInline description={store.error}>
          <Button type={ButtonType.Action} onClick={() => this.getRoutes()}>
            {Localization.sharedValue("Retry")}
          </Button>
        </ErrorInline>
      );
    }

    return (
      <>
        <PageHeaderComponent
          path={[{ title: "Ruter" }]}
          tabs={[
            {
              title: RouteStatus.map.requested.name,
              name: "requested"
            },
            {
              title: RouteStatus.map.assigned.name,
              name: "assigned"
            },
            {
              title: RouteStatus.map.started.name,
              name: "started"
            },
            {
              title: RouteStatus.map.completed.name,
              name: "completed"
            },
            {
              title: RouteStatus.map.cancelled.name,
              name: "cancelled"
            }
          ]}
          onTabChange={name => {
            // tslint:disable-next-line:no-any
            store.routeStatusFilter = new RouteStatus(name as any);
            this.setPageAndRefresh(0, undefined, true);
          }}
          tab={store.routeStatusFilter.slug}
        />

        <PageContentComponent>
          <PageHeader
            search={{
              placeholder: Localization.sharedValue("Search_TypeToSearch"),
              onChange: (value, event) => {
                store.searchQueries = value;
                if (event) {
                  event.persist();
                }

                this.onSearchChange(value);
              },
              value: store.searchQueries
            }}
          />

          <TableComponent
            loading={store.loading}
            gridTemplateColumns="15% 15% 10% 10% 40% 10%"
            sorting={{
              current: {
                key: store.sorting.key,
                direction: store.sorting.direction
              },
              onChange: (key, direction) =>
                this.sortData(
                  new RoutesListSorting(key as RoutesListSortingKey, direction)
                )
            }}
            generateURL={index => {
              return SubPage.path(SubPage.RouteDetails).replace(
                ":id",
                store.routes![index].id
              );
            }}
            totalRowsText={Localization.sharedValue("Routes_List_TotalCount", {
              count: Localization.formatNumber(store.totalCount)
            })}
            pagination={{
              pages: Math.ceil(store.totalCount / store.resultsPerPage),
              currentPageIndex: store.pageIndex,
              resultsPerPage: store.resultsPerPage,
              onPageChange: nextPageIndex =>
                this.setPageAndRefresh(nextPageIndex, store.searchQueries, true)
            }}
            data={{
              headers: store.headers,
              rows: this.getRows()
            }}
          />
        </PageContentComponent>
      </>
    );
  }

  private setPageAndRefresh(
    pageIndex: number,
    query: string | undefined,
    pushState: boolean
  ): void {
    store.searchQueries = query;
    if (
      store.pageIndex !== pageIndex ||
      history.state == null ||
      history.state.query == null
    ) {
      store.pageIndex = pageIndex;
      if (pushState) {
        history.pushState(
          {
            ...history.state,
            stateGroup: "routes/list",
            pageIndex: pageIndex,
            query: query
          },
          "",
          `${SubPage.path(SubPage.RouteList)}/${pageIndex + 1}`
        );
      }
    } else if (pushState) {
      history.replaceState(
        { ...history.state, query: query },
        "",
        location.href
      );
    }
    this.getRoutes();
  }
}
