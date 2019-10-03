import { observer } from "mobx-react";
import H from "history";
import Localization from "shared/src/localization";
import React from "react";
import KpiTableComponent from "../../components/table";
import OrderGroupService from "fulfiller/src/services/orderGroupService";
import { DateTime } from "luxon";
import { KpiService } from "../../service";
import { OutfitData } from "../../models/outfitData";
import { KpiFormat } from "../../models/kpiFormat";
import { KpiStore } from "../../store";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";

export const consignorsKpiStore = new KpiStore();

interface Props {
  history?: H.History;
}

@observer
export default class ConsignorsKpiComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.sharedValue("Kpi_Title");

    this.fetchConsignors();
  }

  componentWillMount() {
    if (consignorsKpiStore.outfitsData) {
      this.fetchKpi();
    }
  }

  private fetchKpi() {
    if (consignorsKpiStore.outfitsData) {
      // Reset kpi data for current tab
      consignorsKpiStore.outfitsData[
        consignorsKpiStore.activeOutfitIndex
      ].outfitKpi = undefined;
      // Set current tab's chosen date
      consignorsKpiStore.outfitsData[
        consignorsKpiStore.activeOutfitIndex
      ].toDateChosen =
        consignorsKpiStore.outfitsData[
          consignorsKpiStore.activeOutfitIndex
        ].toDate;

      consignorsKpiStore.loading = true;

      KpiService.fulfiller(
        consignorsKpiStore.outfitsData[consignorsKpiStore.activeOutfitIndex]
          .toDateChosen,
        consignorsKpiStore.outfitsData[consignorsKpiStore.activeOutfitIndex]
          .format,
        consignorsKpiStore.outfitsData[consignorsKpiStore.activeOutfitIndex]
          .outfit!.id
      )
        .then(kpiTemplate => {
          consignorsKpiStore.outfitsData![
            consignorsKpiStore.activeOutfitIndex
          ].outfitKpi = kpiTemplate;

          consignorsKpiStore.loading = false;
        })
        .catch(error => {
          consignorsKpiStore.error = error.message;
        });
    }
  }

  private fetchConsignors() {
    OrderGroupService.listConsignors()
      .then(consignors => {
        consignorsKpiStore.outfitsData = consignors.map(consignor => {
          return new OutfitData(
            consignor,
            DateTime.local(),
            DateTime.local(),
            new KpiFormat("numbers")
          );
        });
        this.fetchKpi();
      })
      .catch(error => {
        consignorsKpiStore.error = error.message;
      });
  }

  renderTable() {
    if (!consignorsKpiStore.loading) {
      return (
        <KpiTableComponent
          fetchData={() => this.fetchKpi()}
          dateChange={date => {
            consignorsKpiStore.outfitsData![
              consignorsKpiStore.activeOutfitIndex
            ].toDate = date;
          }}
          formatChange={format => {
            consignorsKpiStore.outfitsData![
              consignorsKpiStore.activeOutfitIndex
            ].format = format;
          }}
          data={
            consignorsKpiStore.outfitsData![
              consignorsKpiStore.activeOutfitIndex
            ]
          }
        />
      );
    } else {
      return (
        <KpiTableComponent
          fetchData={() => this.fetchKpi()}
          dateChange={date => {
            consignorsKpiStore.outfitsData![
              consignorsKpiStore.activeOutfitIndex
            ].toDate = date;
          }}
          formatChange={format => {
            consignorsKpiStore.outfitsData![
              consignorsKpiStore.activeOutfitIndex
            ].format = format;
          }}
          data={undefined}
        />
      );
    }
  }

  render() {
    const tabs = consignorsKpiStore.outfitsData
    ? consignorsKpiStore.outfitsData.map(consignorData => {
        return {
          name: `outfit:${consignorData.outfit!.id}`,
          title: consignorData.outfit!.primaryName
        };
      })
    : undefined;

    return (
      <>
        <PageHeaderComponent
          path={[{ title: "KPI", href: "/kpi" }, { title: "Consignors" }]}
          history={this.props.history}
          tabs={tabs}
          tab={tabs ? tabs[consignorsKpiStore.activeOutfitIndex].name : undefined}
          onTabChange={(tab, index) => {
            consignorsKpiStore.activeOutfitIndex = index;
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
