import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import {
  PageHeader,
  TableComponent,
  ErrorInline,
  Button,
  ButtonType,
  ButtonAdd,
  ButtonSize
} from "shared/src/webKit";
import Localization from "../../../localization";
import {
  OrderListStore,
  OrderListSorting,
  OrdersListSortingKey
} from "./store";
import { Order, OrderStatus } from "./models/order";
import H from "history";
import { DateTime } from "luxon";
import { SubPage } from "shared/src/utillity/page";
import { debounce } from "throttle-debounce";
import OrderService from "../service";
import { PageHeaderComponent } from "../../pageHeader";
import { PageContentComponent } from "../../pageContent";

const store = new OrderListStore();

interface Props {
  history?: H.History;
}

@observer
export default class OrderListComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue("Orders_List_Title");
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
      event.state.stateGroup === "order/list" &&
      event.state.pageIndex != null
    ) {
      this.setPageAndRefresh(event.state.pageIndex, event.state.query, false);
    } else {
      this.setPageAndRefresh(0, undefined, false);
    }
    // tslint:disable-next-line:semicolon
  };

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
    this.getOrderList();
  }

  onSearchChange(query: string | undefined) {
    this.setPageAndRefresh(0, query, true);
  }

  getOrderList() {
    const requestId = ++this.lastRequestId;
    if (store.orders === undefined) {
      store.sortLoading = false;
      store.loading = true;
    } else {
      store.sortLoading = true;
      store.loading = false;
    }
    store.error = undefined;

    var filters: string[] = [];
    if (store.searchQueries !== undefined) {
      filters = store.searchQueries.split(" ").filter(value => value !== "");
    }

    OrderService.list(
      store.pageIndex + 1,
      store.resultsPerPage,
      filters,
      store.orderStatusFilter,
      store.sorting
    )
      .then(response => {
        if (requestId !== this.lastRequestId) {
          return;
        }
        store.orders = response.orders;
        store.totalCount = response.totalCount;
        store.sortLoading = false;
        store.loading = false;
      })
      .catch(error => {
        if (requestId !== this.lastRequestId) {
          return;
        }
        store.error = error.message;
        store.orders = [];
        store.sortLoading = false;
        store.loading = false;
      });
  }

  sortData(sorting: OrderListSorting) {
    store.sorting = sorting;

    this.getOrderList();
  }

  getRows(orders: Order[]) {
    let rows: string[][] = [];
    orders.map(order => {
      rows.push([
        order.publicId,
        order.status.name,
        `${order.earliestPickupDate.toLocaleString(DateTime.DATE_SHORT)}`,
        `${order.earliestPickupTime.toString()} - ${order.latestPickupTime.toString()}`,
        order.pickupLocation.address.toString(),
        order.deliveryLocation.address.toString()
      ]);
    });

    return rows;
  }

  render() {
    if (store.error) {
      return (
        <ErrorInline description={store.error}>
          <Button type={ButtonType.Action} onClick={() => this.getOrderList()}>
            {Localization.sharedValue("Retry")}
          </Button>
        </ErrorInline>
      );
    }

    return (
      <>
        <PageHeaderComponent
          path={[{ title: "Ordrer" }]}
          tabs={[
            {
              title: OrderStatus.map.all.name,
              name: OrderStatus.map.all.slug
            },
            {
              title: OrderStatus.map.placed.name,
              name: OrderStatus.map.placed.slug
            },
            {
              title: OrderStatus.map.ready.name,
              name: OrderStatus.map.ready.slug
            },
            {
              title: OrderStatus.map.delivered.name,
              name: OrderStatus.map.delivered.slug
            },
            {
              title: OrderStatus.map.cancelled.name,
              name: OrderStatus.map.cancelled.slug
            },
            {
              title: OrderStatus.map.deleted.name,
              name: OrderStatus.map.deleted.slug
            }
          ]}
          onTabChange={name => {
            // tslint:disable-next-line:no-any
            store.orderStatusFilter = new OrderStatus(
              // tslint:disable-next-line: no-any
              name.toLowerCase() as any
            );
            this.setPageAndRefresh(0, undefined, true);
          }}
          tab={store.orderStatusFilter.slug}
        >
          <ButtonAdd
            size={ButtonSize.Medium}
            type={ButtonType.Light}
            onClick={() =>
              this.props.history!.push(SubPage.path(SubPage.OrderCreate))
            }
          >
            Opret ordre
          </ButtonAdd>
        </PageHeaderComponent>

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
            loading={store.sortLoading}
            gridTemplateColumns="20% 10% 12.5% 12.5% 22.5% 22.5%"
            sorting={{
              current: {
                key: store.sorting.key,
                direction: store.sorting.direction
              },
              onChange: (key, direction) =>
                this.sortData(
                  new OrderListSorting(key as OrdersListSortingKey, direction)
                )
            }}
            generateURL={index => {
              return SubPage.path(SubPage.OrderDetails).replace(
                ":id",
                store.orders![index].publicId
              );
            }}
            totalRowsText={Localization.sharedValue(
              "Orders_List_TotalCount"
            ).replace("{count}", Localization.formatNumber(store.totalCount))}
            pagination={{
              pages: Math.ceil(store.totalCount / store.resultsPerPage),
              currentPageIndex: store.pageIndex,
              resultsPerPage: store.resultsPerPage,
              onPageChange: nextPageIndex =>
                this.setPageAndRefresh(nextPageIndex, store.searchQueries, true)
            }}
            data={{
              headers: store.headers,
              rows: this.getRows(store.orders)
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
            stateGroup: "order/list",
            pageIndex: pageIndex,
            query: query
          },
          "",
          `${SubPage.path(SubPage.OrderList)}/${pageIndex + 1}`
        );
      }
    } else if (pushState) {
      history.replaceState(
        { ...history.state, query: query },
        "",
        location.href
      );
    }
    this.getOrderList();
  }
}
