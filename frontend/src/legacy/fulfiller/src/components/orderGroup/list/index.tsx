import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import {
  TableComponent,
  ErrorInline,
  Button,
  ButtonType
} from "shared/src/webKit";
import H from "history";
import Localization from "shared/src/localization";
import OrderGroupService from "../../../services/orderGroupService";
import { OrderGroupListStore } from "./store";
import { OrderGroup } from "../../../../../shared/src/model/logistics/orderGroups/orderGroup";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { FulfillerSubPage } from "../../navigation/page";
import { PageContentComponent } from "shared/src/components/pageContent";

const orderGroupListStore = new OrderGroupListStore();

interface Props {
  history?: H.History;
}

@observer
export default class OrderGroupListComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue("OrderGroups_List_Title");
  }

  componentDidMount() {
    this.getOrderGroupList();
  }

  private getOrderGroupList() {
    if (orderGroupListStore.orderGroups) {
      orderGroupListStore.loading = true;
    } else {
      orderGroupListStore.loading = false;
    }
    orderGroupListStore.error = undefined;

    OrderGroupService.getOrderGroups()
      .then(response => {
        orderGroupListStore.orderGroups = response;
        orderGroupListStore.loading = false;
      })
      .catch(error => {
        orderGroupListStore.error = error.message;
        orderGroupListStore.orderGroups = [];
        orderGroupListStore.loading = false;
      });
  }

  private getRanges(group: OrderGroup): string {
    let ranges: string[] = [];
    group.matchingCriterias.map(criteria => {
      ranges.push(criteria.zipRanges.join(", "));
    });

    return ranges.join(" - ");
  }

  private getConsignors(group: OrderGroup): string {
    let ranges: string[] = [];
    group.matchingCriterias.map(criteria => {
      ranges.push(criteria.consignors.map(c => c.companyName).join(", "));
    });

    return ranges.join(" - ");
  }

  private getRows(orderGroups: OrderGroup[]) {
    let rows: string[][] = [];
    orderGroups.map(orderGroup => {
      rows.push([
        orderGroup.name,
        this.getRanges(orderGroup),
        this.getConsignors(orderGroup),
        String(orderGroup.matchingCriterias.length)
      ]);
    });

    return rows;
  }

  render() {

    if (orderGroupListStore.error) {
      return (
        <ErrorInline description={orderGroupListStore.error}>
          <Button
            type={ButtonType.Action}
            onClick={() => this.getOrderGroupList()}
          >
            {Localization.sharedValue("Retry")}
          </Button>
        </ErrorInline>
      );
    }

    return (
      <>
        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: "Ruteplanlægning" }
          ]}
          tabs={[
            {
              title: "Ruteplaner",
              name: "route-plans",
              href: FulfillerSubPage.path(FulfillerSubPage.RoutePlanningList)
            },
            {
              title: "Indstillinger",
              name: "settings",
              href: FulfillerSubPage.path(FulfillerSubPage.RoutePlanningSettingList)
            },
            {
              title: "Ordregrupper",
              name: "order-groups",
              href: FulfillerSubPage.path(FulfillerSubPage.OrderGroupList)
            },
            {
              title: "Simulationer",
              name: "simulations",
              href: FulfillerSubPage.path(FulfillerSubPage.SimulationList)
            }
          ]}
          tab="order-groups"
        >

          {/* <ButtonAdd
            size={ButtonSize.Medium}
            type={ButtonType.Light}
            onClick={() => this.props.history!.push(FulfillerSubPage.path(FulfillerSubPage.OrderGroupCreate))}
          >
            Tilføj ordregruppe
          </ButtonAdd> */}

        </PageHeaderComponent>

        <PageContentComponent>

          <TableComponent
            gridTemplateColumns="25% 25% 25% 25%"
            loading={orderGroupListStore.loading}
            canSelectRow={() => false}
            data={{
              headers: orderGroupListStore.headers,
              rows: this.getRows(orderGroupListStore.orderGroups)
            }}
          />
        </PageContentComponent>

      </>
    );
  }
}
