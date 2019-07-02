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

interface Props {}

@observer
export default class FulfillersKpiComponent extends React.Component<Props> {
  fulfillersKpiStore = new KpiStore();

  constructor(props: Props) {
    super(props);
    document.title = Localization.sharedValue("Kpi_Title");

    this.fetchFulfillers();
  }

  componentWillMount() {
    if (this.fulfillersKpiStore.outfitsData) {
      this.fetchKpi();
    }
  }

  private fetchKpi() {
    if (this.fulfillersKpiStore.outfitsData) {
      // Reset kpi data for current tab
      this.fulfillersKpiStore.outfitsData[
        this.fulfillersKpiStore.activeOutfitIndex
      ].outfitKpi = undefined;
      // Set current tab's chosen date
      this.fulfillersKpiStore.outfitsData[
        this.fulfillersKpiStore.activeOutfitIndex
      ].toDateChosen = this.fulfillersKpiStore.outfitsData[
        this.fulfillersKpiStore.activeOutfitIndex
      ].toDate;

      this.fulfillersKpiStore.loading = true;

      KpiService.fulfiller(
        this.fulfillersKpiStore.outfitsData[
          this.fulfillersKpiStore.activeOutfitIndex
        ].toDateChosen,
        this.fulfillersKpiStore.outfitsData[
          this.fulfillersKpiStore.activeOutfitIndex
        ].format,
        undefined,
        this.fulfillersKpiStore.outfitsData[
          this.fulfillersKpiStore.activeOutfitIndex
        ].outfit
      )
        .then(kpiTemplate => {
          this.fulfillersKpiStore.outfitsData![
            this.fulfillersKpiStore.activeOutfitIndex
          ].outfitKpi = kpiTemplate;

          this.fulfillersKpiStore.loading = false;
        })
        .catch(error => {
          this.fulfillersKpiStore.error = error.message;
        });
    }
  }

  private fetchFulfillers() {
    AgreementsService.fulfillers()
      .then(fulfillers => {
        this.fulfillersKpiStore.outfitsData = fulfillers.map(fulfiller => {
          return new OutfitData(
            fulfiller,
            DateTime.local(),
            DateTime.local(),
            new KpiFormat("numbers")
          );
        });

        this.fulfillersKpiStore.outfitsData.unshift(
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
        this.fulfillersKpiStore.error = error.message;
      });
  }

  renderTable() {
    if (!this.fulfillersKpiStore.loading) {
      return (
        <KpiTableComponent
          fetchData={() => this.fetchKpi()}
          dateChange={date => {
            this.fulfillersKpiStore.outfitsData![
              this.fulfillersKpiStore.activeOutfitIndex
            ].toDate = date;
          }}
          formatChange={format => {
            this.fulfillersKpiStore.outfitsData![
              this.fulfillersKpiStore.activeOutfitIndex
            ].format = format;
          }}
          data={
            this.fulfillersKpiStore.outfitsData![
              this.fulfillersKpiStore.activeOutfitIndex
            ]
          }
        />
      );
    } else {
      return (
        <KpiTableComponent
          fetchData={() => this.fetchKpi()}
          dateChange={date => {
            this.fulfillersKpiStore.outfitsData![
              this.fulfillersKpiStore.activeOutfitIndex
            ].toDate = date;
          }}
          formatChange={format => {
            this.fulfillersKpiStore.outfitsData![
              this.fulfillersKpiStore.activeOutfitIndex
            ].format = format;
          }}
          data={undefined}
        />
      );
    }
  }

  render() {
    var tabs: { name: string; title: string }[] | undefined;
    if (this.fulfillersKpiStore.outfitsData) {
      if (this.fulfillersKpiStore.outfitsData.length === 0) {
        tabs = [
          {
            name: "overview",
            title: Localization.sharedValue("Kpi_Tab_OverallData")
          }
        ];
      } else {
        tabs = this.fulfillersKpiStore.outfitsData.map(consignorData => {
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
        });
      }
    } else {
      tabs = undefined;
    }

    return (
      <>
        <PageHeaderComponent
          path={[{ title: "KPIs" }]}
          tabs={tabs}
          tab={
            tabs
              ? tabs[this.fulfillersKpiStore.activeOutfitIndex].name
              : undefined
          }
          onTabChange={(tab, index) => {
            this.fulfillersKpiStore.activeOutfitIndex = index;
            this.fetchKpi();
          }}
        />

        <PageContentComponent>{this.renderTable()}</PageContentComponent>
      </>
    );
  }
}
