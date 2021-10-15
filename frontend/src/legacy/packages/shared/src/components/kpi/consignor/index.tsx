import { observer } from "mobx-react";
import H from "history";
import Localization from "shared/src/localization";
import React from "react";
import KpiTableComponent from "../components/table";
import { KpiService } from "../service";
import { KpiStore } from "../store";
import { PageHeaderComponent } from "../../pageHeader";
import { PageContentComponent } from "../../pageContent";

export const consignorKpiStore = new KpiStore();

interface Props {
  history?: H.History;
}

@observer
export default class ConsignorKpiComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.sharedValue("Kpi_Title");

    /*
    consignorKpiStore.outfitsData = [
      new OutfitData(
        Session.outfit,
        DateTime.local(),
        DateTime.local(),
        new KpiFormat("numbers")
      )
    ];
    this.fetchKpi();

    */
  }

  componentWillMount() {
    if (consignorKpiStore.outfitsData) {
      this.fetchKpi();
    }
  }

  private fetchKpi() {
    if (consignorKpiStore.outfitsData) {
      // Reset kpi data for current tab
      consignorKpiStore.outfitsData[
        consignorKpiStore.activeOutfitIndex
      ].outfitKpi = undefined;
      // Set current tab's chosen date
      consignorKpiStore.outfitsData[
        consignorKpiStore.activeOutfitIndex
      ].toDateChosen =
        consignorKpiStore.outfitsData[
          consignorKpiStore.activeOutfitIndex
        ].toDate;

      consignorKpiStore.loading = true;

      KpiService.consignor(
        consignorKpiStore.outfitsData[consignorKpiStore.activeOutfitIndex]
          .connection!.organization.id,
        consignorKpiStore.outfitsData[consignorKpiStore.activeOutfitIndex]
          .toDateChosen,
        consignorKpiStore.outfitsData[consignorKpiStore.activeOutfitIndex]
          .format
      )
        .then(kpiTemplate => {
          consignorKpiStore.outfitsData![
            consignorKpiStore.activeOutfitIndex
          ].outfitKpi = kpiTemplate;

          consignorKpiStore.loading = false;
        })
        .catch(error => {
          consignorKpiStore.error = error.message;
        });
    }
  }

  renderTable() {
    if (!consignorKpiStore.loading) {
      return (
        <KpiTableComponent
          fetchData={() => this.fetchKpi()}
          dateChange={date => {
            consignorKpiStore.outfitsData![
              consignorKpiStore.activeOutfitIndex
            ].toDate = date;
          }}
          formatChange={format => {
            consignorKpiStore.outfitsData![
              consignorKpiStore.activeOutfitIndex
            ].format = format;
          }}
          data={
            consignorKpiStore.outfitsData![consignorKpiStore.activeOutfitIndex]
          }
        />
      );
    } else {
      return (
        <KpiTableComponent
          fetchData={() => this.fetchKpi()}
          dateChange={date => {
            consignorKpiStore.outfitsData![
              consignorKpiStore.activeOutfitIndex
            ].toDate = date;
          }}
          formatChange={format => {
            consignorKpiStore.outfitsData![
              consignorKpiStore.activeOutfitIndex
            ].format = format;
          }}
          data={undefined}
        />
      );
    }
  }

  render() {
    const tabs = consignorKpiStore.outfitsData
      ? consignorKpiStore.outfitsData.map(consignorData => {
          if (consignorData.connection) {
            return {
              name: `outfit:${consignorData.connection.organization.id}`,
              title: consignorData.connection.organization.name
            };
          } else {
            return {
              name: "overview",
              title: Localization.sharedValue("Kpi_Tab_OverallData")
            };
          }
        })
      : undefined;

    return (
      <>
        <PageHeaderComponent
          path={[{ title: "KPI", href: "/kpi" }, { title: "Consignors" }]}
          history={this.props.history}
          tabs={tabs}
          tab={tabs ? tabs[consignorKpiStore.activeOutfitIndex].name : undefined}
          onTabChange={(tab, index) => {
            consignorKpiStore.activeOutfitIndex = index;
            this.fetchKpi();
          }}
        />

        <PageContentComponent>

          {this.renderTable()}

        </PageContentComponent>

      </>
    );
  }
}
