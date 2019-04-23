import React from "react";
import { observer } from "mobx-react";
import { DateTime } from "luxon";
import {
  TableComponent,
  InputCheckbox,
  LoadingInline,
  InputTextarea,
  LoadingOverlay
} from "shared/src/webKit";
import Localization from "shared/src/localization";
import DateComponent from "shared/src/webKit/date/date";
import {
  DepotRoute,
  DepotRouteService
} from "./services/depotRouteService/index";
import { Row } from "shared/src/webKit/table";
import { Dialog } from "shared/src/components/dialog/dialog";
import { observable } from "mobx";
import "./index.scss";
import { SubPage } from "shared/src/utillity/page";

interface Props {
  depotId: string;
}

@observer
export default class DepotActivityComponent extends React.Component<Props> {
  private service = new DepotRouteService();

  @observable
  private openRoute: DepotRoute | undefined;

  @observable
  private savingRemarks = false;

  private date = DateTime.local().startOf("day");

  // tslint:disable-next-line:no-any
  public constructor(props: Props) {
    super(props);
  }

  public async componentWillMount() {
    const dateMatch = location.href.match(/\?date=([^&#]+)/);

    if (dateMatch) {
      this.date = DateTime.fromISO(dateMatch[1]);
    }

    await this.service.startPolling(this.props.depotId, this.date);
  }

  public async componentWillUnmount() {
    this.service.stopPolling();
  }

  public render() {
    if (this.service.routes == null) {
      return <LoadingInline />;
    }

    return (
      <>
        <DateComponent
          className="c-depots-activity-date"
          headline="Vælg dato"
          date={this.date}
          size="medium"
          onChange={value => {
            this.date = value;
            this.service.startPolling(this.props.depotId, value);
            history.replaceState(
              history.state,
              "",
              location.href.replace(/\?.*|$/, "?date=" + value.toISODate())
            );
          }}
        />

        <TableComponent
          canSelectRow={() => false}
          totalRowsText={Localization.operationsValue(
            "Depots_Activity_TotalCount",
            {
              count: Localization.formatNumber(this.service.routes.length)
            }
          )}
          data={{
            headers: [
              { key: "route", text: "Rute" },
              { key: "port", text: "Port" },
              { key: "fulfiller", text: "Logistikpartner" },
              { key: "planned-arrival", text: "Planlagt ankomst" },
              { key: "actual-arrival", text: "Chauffør ankomst" },
              { key: "actual-departure", text: "Chauffør afgang" },
              { key: "colli-status", text: "Kolli scannet / total" },
              { key: "driver-list-ready", text: "Køreliste klar" },
              { key: "print-driver-list", text: "" },
              { key: "report-problem", text: "" }
            ],
            rows: this.getRows(this.service.routes)
          }}
        />

        {this.openRoute != null && (
          <Dialog
            title={`Problemer med rute ${this.openRoute.slug}`}
            onClose={() => this.saveOpenRoute()}
            disabled={this.savingRemarks}
          >
            {this.savingRemarks && <LoadingOverlay fade={false} />}

            <div className="c-depots-activity-remarks">
              <InputTextarea
                size="medium"
                className="c-depots-activity-remarks-notes"
                headline="Bemærkninger"
                rows={2}
                value={this.openRoute.note}
                onChange={value => (this.openRoute!.note = value)}
              />

              <div className="inputHeadline font-heading">
                Årsag til forsinkelse
              </div>

              {this.service.remarks.map(i => (
                <InputCheckbox
                  key={`problem-${i.code}`}
                  checked={this.openRoute!.hasRemarks(i)}
                  onChange={checked =>
                    checked
                      ? this.openRoute!.addRemark(i)
                      : this.openRoute!.removeRemark(i)
                  }
                >
                  <span className="c-depots-activity-remarks-code">
                    {i.code}
                  </span>{" "}
                  {i.name}
                </InputCheckbox>
              ))}
            </div>
          </Dialog>
        )}
      </>
    );
  }

  private getRows(routes: DepotRoute[]) {
    let rows: Row[][] = [];
    routes.map(route => {
      const hasDelayedArrival =
        route.actualArrival &&
        route.actualArrival.valueOf() > route.plannedArrival.valueOf();

      const hasDelayedDeparture =
        route.actualDeparture &&
        route.actualDeparture.valueOf() > route.plannedDeparture.valueOf();

      rows.push([
        // tslint:disable-next-line:jsx-wrap-multiline
        <a
          key={`route-slug-${route.slug}`}
          href={SubPage.path(SubPage.RouteDetails).replace(":id", route.slug)}
          target="_blank"
        >
          {route.slug}
        </a>,
        route.gate ? route.gate : "--",
        route.fulfillerName,
        Localization.formatTime(route.plannedArrival),
        // tslint:disable-next-line:jsx-wrap-multiline
        <>
          {route.actualArrival ? (
            <span
              className={hasDelayedArrival ? "c-depots-activity-alert" : ""}
            >
              {Localization.formatTime(route.actualArrival)}
            </span>
          ) : (
            "--"
          )}
        </>,
        // tslint:disable-next-line:jsx-wrap-multiline
        <>
          {route.actualDeparture ? (
            <span
              className={hasDelayedDeparture ? "c-depots-activity-alert" : ""}
            >
              {Localization.formatTime(route.actualDeparture)}
            </span>
          ) : (
            "--"
          )}
        </>,
        `${route.colliScanned == null ? "--" : route.colliScanned} / ${
          route.colliTotal == null ? "--" : route.colliTotal
        }`,
        route.driverListReady ? "Ja" : "Nej",
        // tslint:disable-next-line:jsx-wrap-multiline
        <a
          key={`print-driver-list-${route.slug}`}
          href={route.driverListUrl}
          target="_blank"
        >
          Print Køreliste
        </a>,
        // tslint:disable-next-line:jsx-wrap-multiline
        <a
          key={`report-problem-${route.slug}`}
          onClick={() => {
            this.service.pausePolling();
            this.openRoute = route;
          }}
        >
          {route.remarks.length > 0
            ? `${route.remarks.length} ${
                route.remarks.length === 1 ? "problem" : "problemer"
              }`
            : "Rapporter problem"}
        </a>
      ]);
    });

    return rows;
  }

  private async saveOpenRoute() {
    try {
      this.savingRemarks = true;
      await this.service.saveRoute(this.openRoute!);
      this.savingRemarks = false;
      this.openRoute = undefined;
      this.service.resumePolling();
    } catch (error) {
      alert("Could not save remarks for route");
    }
  }
}
