import { observer } from "mobx-react";
import H from "history";
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

interface Props {
  history?: H.History;
}

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
        ].connection
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
    AgreementsService.connections()
      .then(connections => {
        this.fulfillersKpiStore.outfitsData = connections.map(connection => {
          return new OutfitData(
            connection,
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
      .catch(() => {
        this.fulfillersKpiStore.outfitsData = [];

        this.fulfillersKpiStore.outfitsData.unshift(
          new OutfitData(
            undefined,
            DateTime.local(),
            DateTime.local(),
            new KpiFormat("numbers")
          )
        );

        this.fetchKpi();
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
        });
      }
    } else {
      tabs = [];
    }

    return (
      <>
        <PageHeaderComponent
          path={[{ title: "KPI", href: "/kpi" }]}
          history={this.props.history}
          tabs={tabs}
          tab={tabs?.length > 0 ? tabs[this.fulfillersKpiStore.activeOutfitIndex].name : undefined}
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
