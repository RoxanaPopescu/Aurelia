import React from "react";
import { observer } from "mobx-react";
import { DateTime } from "luxon";
import { ErrorInline, TableComponent, PageHeader } from "shared/src/webKit";
import DateComponent from "shared/src/webKit/date/date";
import { DepotColliService } from "./service";
import { observable } from "mobx";
import "./index.scss";
import { Row } from "shared/src/webKit/table";
import DepotScannedColliInfoComponent from "./components/info";
import { SubPage } from "shared/src/utillity/page";
import { ScannedColliOverview } from "./model/overview";
import Localization from "shared/src/localization";

interface Props {
  depotId: string;
}

const pageCount = 100;

@observer
export default class DepotScannedColliComponent extends React.Component<Props> {
  @observable private error: Error;
  private date = DateTime.local().startOf("day");
  private service = new DepotColliService();
  @observable private currentPageIndex = 0;

  public componentWillMount() {
    this.fetch();
  }

  public async fetch() {
    this.service.reset();

    let fromDate = this.date;
    let toDate = this.date.endOf("day");

    var overviewPromise = this.service.fetchOverview(
      this.props.depotId,
      fromDate,
      toDate
    );
    var missingPromise = this.service.fetchMissing(
      this.props.depotId,
      fromDate,
      toDate,
      this.service.selectedConsignor
    );

    try {
      await Promise.all([{ overviewPromise, missingPromise }]);
    } catch (error) {
      this.error = error;
    }
  }

  public async fetchMissing() {
    let fromDate = this.date;
    let toDate = this.date.endOf("day");

    try {
      await this.service.fetchMissing(
        this.props.depotId,
        fromDate,
        toDate,
        this.service.selectedConsignor
      );
    } catch (error) {
      this.error = error;
    }
  }

  private renderPageHeader() {
    // tslint:disable-next-line:no-any
    var tabs: any[] = [];

    if (this.service.overview) {
      tabs = [{ title: "Alle", key: "all" }].concat(
        this.service.overview.colliMissingByConsignors.map(t => {
          return {
            title: t.consignorName,
            key: t.consignorId
          };
        })
      );
    }

    return (
      <div className="c-depots-top">
        <PageHeader
          tabs={tabs}
          onSelectTab={key => {
            if (key === "all") {
              this.service.selectedConsignor = undefined;
            } else {
              this.service.selectedConsignor = key;
            }
            this.fetchMissing();
          }}
        >
          <DateComponent
            className="c-depots-scannedColli-date"
            headline="Vælg dato"
            size="medium"
            date={this.date}
            onChange={value => {
              this.date = value;
              this.fetch();
            }}
          />
        </PageHeader>
        {this.service.overview && this.renderOverview(this.service.overview)}
      </div>
    );
  }

  private renderOverview(overview: ScannedColliOverview) {
    var correctOverview: {
      missing: number;
      scanned: number;
      total: number;
    } = overview;

    if (this.service.selectedConsignor !== undefined) {
      correctOverview = overview.colliMissingByConsignors.filter(
        c => c.consignorId === this.service.selectedConsignor
      )[0];
    }

    return (
      <div className="c-depots-scannedColli-counts">
        <DepotScannedColliInfoComponent
          title="Ikke skannede"
          description={correctOverview.missing + " kolli"}
        />
        <DepotScannedColliInfoComponent
          title="Skannede"
          description={correctOverview.scanned + " kolli"}
        />
        <DepotScannedColliInfoComponent
          title="Totalt"
          description={correctOverview.total + " kolli"}
        />
      </div>
    );
  }

  public renderMainContent() {
    if (this.error) {
      return (
        <ErrorInline description={this.error.message}/>
      );
    }

    return (
      <React.Fragment>
        {this.renderPageHeader()}
        <TableComponent
          totalRowsText={
            this.service.missingColli
              ? Localization.formatNumber(this.service.missingColli.length) + " Ikke scannede kolli"
              : undefined
          }
          canSelectRow={() => false}
          loading={this.service.loadingColli}
          data={{
            headers: this.getHead(),
            rows: this.getRows()
          }}
          pagination={{
            pages: Math.ceil(this.service.missingColli.length / pageCount),
            currentPageIndex: this.currentPageIndex,
            resultsPerPage: pageCount,
            displayMode: "sticky",
            onPageChange: nextPageIndex =>
              (this.currentPageIndex = nextPageIndex)
          }}
        />
      </React.Fragment>
    );
  }

  private getHead() {
    let rowHead: { key: string; text: string }[] = [];

    rowHead.push({ key: "barcode", text: "Barcode" });
    if (this.service.selectedConsignor === undefined) {
      rowHead.push({ key: "consignorCompanyName", text: "Afsender" });
    }
    rowHead.push({ key: "stopNumber", text: "Stop" });
    rowHead.push({ key: "routeSlug", text: "Rute id" });
    rowHead.push({ key: "routeReference", text: "Rute reference" });
    rowHead.push({ key: "orderId", text: "Ordre id" });

    return rowHead;
  }

  private getRows() {
    let rows: Row[][] = [];
    let currentStart = pageCount * this.currentPageIndex;
    let collis = this.service.missingColli;

    if (collis.length > currentStart) {
      let end: number;
      if (currentStart + pageCount > collis.length) {
        end = collis.length;
      } else {
        end = currentStart + pageCount;
      }

      for (let i = currentStart; i < end; i++) {
        let collo = collis[i];
        let columns: (JSX.Element | string)[] = [];

        columns.push(collo.barcode);
        if (this.service.selectedConsignor === undefined) {
          columns.push(collo.consignorCompanyName);
        }
        columns.push(collo.stopNumber);
        columns.push(
          <a
            key={`collo-route-${collo.barcode}`}
            href={SubPage.path(SubPage.RouteDetails).replace(
              ":id",
              collo.routeSlug
            )}
            target="_blank"
          >
            {collo.routeSlug}
          </a>
        );

        columns.push(collo.routeReference);
        columns.push(
          <a
            key={`collo-barcode-${collo.barcode}`}
            href={
              SubPage.path(SubPage.OrderDetails).replace(":id", collo.slug) +
              "?collo=" +
              collo.barcode
            }
            target="_blank"
          >
            {collo.slug}
          </a>
        );

        rows.push(columns);
      }
    }

    return rows;
  }

  public render() {
    return (
      <div className="c-depots-scannedColli-Container">
        {this.renderMainContent()}
      </div>
    );
  }
}
