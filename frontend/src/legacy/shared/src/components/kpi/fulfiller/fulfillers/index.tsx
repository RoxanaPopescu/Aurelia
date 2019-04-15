import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import React from "react";
import KpiTableComponent from "../../components/table";
import { DateTime } from "luxon";
import { KpiService } from "../../service";
import { AgreementsService } from "shared/src/services/agreementsService";
import { KpiFormat } from "../../models/kpiFormat";
import { OutfitData } from "../../models/outfitData";
import { KpiStore } from "../../store";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";

export const fulfillersKpiStore = new KpiStore();

interface Props {}

@observer
export default class FulfillersKpiComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.sharedValue("Kpi_Title");

    this.fetchFulfillers();
  }

  componentWillMount() {
    if (fulfillersKpiStore.outfitsData) {
      this.fetchKpi();
    }
  }

  private fetchKpi() {
    if (fulfillersKpiStore.outfitsData) {
      // Reset kpi data for current tab
      fulfillersKpiStore.outfitsData[
        fulfillersKpiStore.activeOutfitIndex
      ].outfitKpi = undefined;
      // Set current tab's chosen date
      fulfillersKpiStore.outfitsData[
        fulfillersKpiStore.activeOutfitIndex
      ].toDateChosen =
        fulfillersKpiStore.outfitsData[
          fulfillersKpiStore.activeOutfitIndex
        ].toDate;

      fulfillersKpiStore.loading = true;

      KpiService.fulfiller(
        fulfillersKpiStore.outfitsData[fulfillersKpiStore.activeOutfitIndex]
          .toDateChosen,
        fulfillersKpiStore.outfitsData[fulfillersKpiStore.activeOutfitIndex]
          .format,
        undefined,
        fulfillersKpiStore.outfitsData[fulfillersKpiStore.activeOutfitIndex]
          .outfit
      )
        .then(kpiTemplate => {
          fulfillersKpiStore.outfitsData![
            fulfillersKpiStore.activeOutfitIndex
          ].outfitKpi = kpiTemplate;

          fulfillersKpiStore.loading = false;
        })
        .catch(error => {
          fulfillersKpiStore.error = error.message;
        });
    }
  }

  private fetchFulfillers() {
    AgreementsService.fulfillers()
      .then(fulfillers => {
        fulfillersKpiStore.outfitsData = fulfillers.map(fulfiller => {
          return new OutfitData(
            fulfiller,
            DateTime.local(),
            DateTime.local(),
            new KpiFormat("numbers")
          );
        });

        fulfillersKpiStore.outfitsData.unshift(
          new OutfitData(
            undefined,
            DateTime.local(),
            DateTime.local(),
            new KpiFormat("numbers")
          )
        );
        this.fetchKpi();
      })
      .catch(error => {
        fulfillersKpiStore.error = error.message;
      });
  }

  renderTable() {
    if (!fulfillersKpiStore.loading) {
      return (
        <KpiTableComponent
          fetchData={() => this.fetchKpi()}
          dateChange={date => {
            fulfillersKpiStore.outfitsData![
              fulfillersKpiStore.activeOutfitIndex
            ].toDate = date;
          }}
          formatChange={format => {
            fulfillersKpiStore.outfitsData![
              fulfillersKpiStore.activeOutfitIndex
            ].format = format;
          }}
          data={
            fulfillersKpiStore.outfitsData![
              fulfillersKpiStore.activeOutfitIndex
            ]
          }
        />
      );
    } else {
      return (
        <KpiTableComponent
          fetchData={() => this.fetchKpi()}
          dateChange={date => {
            fulfillersKpiStore.outfitsData![
              fulfillersKpiStore.activeOutfitIndex
            ].toDate = date;
          }}
          formatChange={format => {
            fulfillersKpiStore.outfitsData![
              fulfillersKpiStore.activeOutfitIndex
            ].format = format;
          }}
          data={undefined}
        />
      );
    }
  }

  render() {
    const tabs = fulfillersKpiStore.outfitsData
      ? fulfillersKpiStore.outfitsData.map(consignorData => {
          if (consignorData.outfit) {
            return {
              name: `outfit:${consignorData.outfit.id}`,
              title: consignorData.outfit.primaryName
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
          path={[
            { title: "KPIs" }
          ]}
          tabs={tabs}
          tab={tabs ? tabs[fulfillersKpiStore.activeOutfitIndex].name : undefined}
          onTabChange={(tab, index) => {
            fulfillersKpiStore.activeOutfitIndex = index;
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
