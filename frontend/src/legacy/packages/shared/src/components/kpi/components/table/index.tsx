import "./styles.scss";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import React from "react";
import { Button, ButtonType } from "shared/src/webKit";
import DateComponent from "shared/src/webKit/date/date";
import { DateTime } from "luxon";
import { OutfitData } from "../../models/outfitData";
import { KpiFormat } from "../../models/kpiFormat";

interface Props {
  data?: OutfitData;
  dateChange(date: DateTime);
  formatChange(format: KpiFormat);
  fetchData();
}

interface State {
  format: KpiFormat;
  date: DateTime;
  hovered?: { x: number; y: number };
}

@observer
export default class KpiTableComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      format: new KpiFormat("numbers"),
      date: DateTime.local()
    };
  }

  /*
  ** Renders formats
  */
  private renderFormats() {
    let formats: JSX.Element[] = [];

    formats.push(
      <div
        key="format-number"
        onClick={() => {
          this.props.formatChange(new KpiFormat("numbers"));
          this.setState({ format: new KpiFormat("numbers") });
        }}
        className={`c-fulfillerKpi-formatToggle-format${
          this.state.format.slug === "numbers" ? " active" : ""
        }`}
      >
        {new KpiFormat("numbers").name}
      </div>
    );
    formats.push(
      <div
        key="format-percentage"
        onClick={() => {
          this.props.formatChange(new KpiFormat("percentage"));
          this.setState({ format: new KpiFormat("percentage") });
        }}
        className={`c-fulfillerKpi-formatToggle-format${
          this.state.format.slug === "percentage" ? " active" : ""
        }`}
      >
        {new KpiFormat("percentage").name}
      </div>
    );

    return formats;
  }

  /*
  ** Renders action elements
  */
  private renderActionContainer() {
    return (
      <>
        <div key={`kpiDataFormat`} className="c-fulfillerKpi-formatToggle">
          {this.renderFormats()}
        </div>
        <DateComponent
          maximum={DateTime.local()}
          key={`kpiDateTo`}
          size={"medium"}
          onChange={date => {
            this.setState({ date: date });
            this.props.dateChange(date);
          }}
          date={this.state.date}
          placeholder="DD.MM.ÅÅ"
          className="c-fulfillerKpi-dateComponent"
        />
        <Button
          key={`button-getKpi`}
          onClick={() => this.props.fetchData()}
          type={ButtonType.Action}
        >
          {Localization.sharedValue("Kpi_Button:ShowData")}
        </Button>
      </>
    );
  }

  /*
  ** Renders Table head
  */
  private renderTableHead(outfitData: OutfitData) {
    let elements: JSX.Element[] = [];

    for (var i = 0; i < outfitData.outfitKpi!.days.length; i++) {
      if (i === 0) {
        elements.push(
          <div
            key={`head-0`}
            className="c-fulfillerKpi-kpiColumn c-fulfillerKpi-kpiColumn-head"
          />
        );
      }

      elements.push(
        <div
          key={`head-${Localization.formatDate(
            outfitData.toDateChosen.minus({
              days: i
            })
          )}`}
          className="c-fulfillerKpi-kpiColumn c-fulfillerKpi-kpiColumn-head"
        >
          {outfitData.toDateChosen
            .minus({
              days: i
            })
            .toFormat("dd/MM/yy")}
        </div>
      );
    }

    elements.push(
      <div
        key="head-last7Days"
        className="c-fulfillerKpi-kpiColumn c-fulfillerKpi-kpiColumn-head"
      >
        {Localization.sharedValue("Kpi_Last7Days")}
      </div>
    );

    elements.push(
      <div
        key="head-last30Days"
        className="c-fulfillerKpi-kpiColumn c-fulfillerKpi-kpiColumn-head"
      >
        {Localization.sharedValue("Kpi_Last30Days")}
      </div>
    );

    return <React.Fragment key="tableHeads">{elements}</React.Fragment>;
  }

  /*
  ** Renders Table elements
  */
  private renderTable(outfitData: OutfitData) {
    let tableElements: JSX.Element[] = [];

    tableElements.push(this.renderTableHead(outfitData));

    let rowIndex = 0;
    // Loops through different KPI groups
    outfitData.outfitKpi!.last30Days.map((kpiGroup, kpiGroupIndex) => {
      // KPI group headline row
      tableElements.push(
        <div
          key={`groupTitle-group${kpiGroupIndex + 1}`}
          className={`c-fulfillerKpi-kpiColumn c-fulfillerKpi-kpiGroupHeadline font-heading${this.hoverClass(
            0,
            this.getRowIndex(kpiGroupIndex, 0)
          )}`}
        >
          {outfitData.outfitKpi!.last30Days[kpiGroupIndex].title}
        </div>
      );
      for (var j = 0; j < 10; j++) {
        tableElements.push(
          <div
            key={`groupTitle-group${kpiGroupIndex + 1}-empty${j}`}
            className={`c-fulfillerKpi-kpiColumn c-fulfillerKpi-kpiGroupHeadline${this.hoverClass(
              j + 1,
              this.getRowIndex(kpiGroupIndex, kpiGroupIndex + 1)
            )}`}
            onMouseOut={() => this.setHover()}
            onMouseOver={() =>
              this.setHover(
                j + 1,
                this.getRowIndex(kpiGroupIndex, kpiGroupIndex)
              )
            }
          />
        );
      }
      rowIndex++;

      // Loop through KPIs in KPI group to get rows
      outfitData.outfitKpi!.last30Days[kpiGroupIndex].kpis.map(
        (kpi, kpiIndex) => {
          // The first 8 columns containing KPI for 8 individual days
          outfitData.outfitKpi!.days.map((day, dayIndex) => {
            // KPI row headline
            if (dayIndex === 0) {
              tableElements.push(
                <div
                  onMouseOut={() => this.setHover()}
                  onMouseOver={() =>
                    this.setHover(
                      dayIndex,
                      this.getRowIndex(kpiGroupIndex, kpiIndex + 1)
                    )
                  }
                  key={`headline-row${rowIndex}-${
                    day[kpiGroupIndex].kpis[kpiIndex].headline
                  }`}
                  className={`c-fulfillerKpi-kpiColumn c-fulfillerKpi-kpiRowHeadline${this.hoverClass(
                    dayIndex,
                    this.getRowIndex(kpiGroupIndex, kpiGroupIndex + 1)
                  )}`}
                >
                  {day[kpiGroupIndex].kpis[kpiIndex].headline}
                </div>
              );
            }

            tableElements.push(
              <div
                onMouseOut={() => this.setHover()}
                onMouseOver={() =>
                  this.setHover(
                    dayIndex + 1,
                    this.getRowIndex(kpiGroupIndex, kpiGroupIndex + 1)
                  )
                }
                key={`day${outfitData.toDate.minus({
                  days: dayIndex
                })}-row${rowIndex}`}
                className={`c-fulfillerKpi-kpiColumn${this.hoverClass(
                  dayIndex + 1,
                  this.getRowIndex(kpiGroupIndex, kpiGroupIndex + 1)
                )}`}
              >
                {day[kpiGroupIndex].kpis[kpiIndex].value}
              </div>
            );
          });

          // 9th column containing kpi for the last 7 days
          tableElements.push(
            <div
              onMouseOut={() => this.setHover()}
              onMouseOver={() =>
                this.setHover(
                  outfitData.outfitKpi!.days.length + 1,
                  this.getRowIndex(kpiGroupIndex, kpiGroupIndex + 1)
                )
              }
              key={`last7Days-row${rowIndex}`}
              className={`c-fulfillerKpi-kpiColumn${this.hoverClass(
                outfitData.outfitKpi!.days.length + 1,
                this.getRowIndex(kpiGroupIndex, kpiGroupIndex + 1)
              )}`}
            >
              {
                outfitData.outfitKpi!.last7Days[kpiGroupIndex].kpis[kpiIndex]
                  .value
              }
            </div>
          );

          // 10th column containing kpi for the last 30 days
          tableElements.push(
            <div
              onMouseOut={() => this.setHover()}
              onMouseOver={() =>
                this.setHover(
                  outfitData.outfitKpi!.days.length + 2,
                  this.getRowIndex(kpiGroupIndex, kpiGroupIndex + 1)
                )
              }
              key={`last30Days-row${rowIndex}`}
              className={`c-fulfillerKpi-kpiColumn${this.hoverClass(
                outfitData.outfitKpi!.days.length + 2,
                this.getRowIndex(kpiGroupIndex, kpiGroupIndex + 1)
              )}`}
            >
              {
                outfitData.outfitKpi!.last30Days[kpiGroupIndex].kpis[kpiIndex]
                  .value
              }
            </div>
          );
          rowIndex++;
        }
      );
    });

    return (
      <div key="kpi-table" className="c-fulfillerKpi-table">
        {tableElements}
      </div>
    );
  }

  private getRowIndex(groupIndex: number, groupRowIndex: number) {
    let rowIndex = 0;
    if (this.props.data) {
      this.props.data.outfitKpi!.last30Days.map((kpiGroup, index) => {
        if (index < groupIndex) {
          rowIndex += kpiGroup.kpis.length;
        }
      });

      rowIndex += groupRowIndex;
    }
    return rowIndex;
  }

  /*
  ** Creates hover class for rows and columns in the table
  */
  private hoverClass(x?: number, y?: number): string {
    let className: string = " ";
    if (this.state.hovered) {
      // if (x === this.state.hovered.x) {
      //   className += " hoveredX";
      // }
      // if (y === this.state.hovered.y) {
      //   className += " hoveredY";
      // }
    }

    return className;
  }

  /*
  ** Sets the coordinate values for hovering in the table
  */
  private setHover(x?: number, y?: number) {
    if (x && y) {
      this.setState({ hovered: { x: x, y: y } });
    } else {
      this.setState({ hovered: undefined });
    }
  }

  /*
  ** Renders the skeleton for when the table is loading
  */
  private renderSkeleton() {
    let bones: JSX.Element[] = [];
    for (var boneIndex = 0; boneIndex < 52; boneIndex++) {
      bones.push(
        <div
          key={`table-skeleton-${boneIndex}`}
          className="c-fulfillerKpi-tableSkeleton-bone"
        />
      );
    }

    return (
      <div className="c-fulfillerKpi loading">
        <div className="c-fulfillerKpi-headline font-large loading" />
        <div className="c-fulfillerKpi-actionContainer">
          <div className="c-fulfillerKpi-actionSkeletonBig c-fulfillerKpi-tableSkeleton-bone" />
          <div className="c-fulfillerKpi-actionSkeletonSmall c-fulfillerKpi-tableSkeleton-bone" />
        </div>
        <div className="c-fulfillerKpi-tableOutercontainer">
          <div key={`table-skeleton`} className="c-fulfillerKpi-tableSkeleton">
            {bones}
          </div>
        </div>
      </div>
    );
  }

  private renderContent(outfitData: OutfitData) {
    return (
      <div className="c-fulfillerKpi">
        <div className="c-fulfillerKpi-actionContainer">
          {this.renderActionContainer()}
        </div>
        <div className="c-fulfillerKpi-tableOutercontainer">
          {this.renderTable(
            new OutfitData(
              outfitData.outfit,
              outfitData.toDate,
              outfitData.toDateChosen,
              new KpiFormat("numbers"),
              outfitData.outfitKpi
            )
          )}
        </div>
      </div>
    );
  }

  render() {
    if (this.props.data !== undefined) {
      return this.renderContent(this.props.data);
    } else {
      return this.renderSkeleton();
    }
  }
}
