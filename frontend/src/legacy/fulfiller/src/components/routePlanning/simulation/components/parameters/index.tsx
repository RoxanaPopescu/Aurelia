import React from "react";
import { observer } from "mobx-react";
import { Polygon, GoogleMap } from "react-google-maps";
import { DividerComponent, InputNumbers } from "shared/src/webKit";
import { WorldMap } from "shared/src/components/worldMap";
import { Position } from "shared/src/model/general/position";
import {
  Parameters,
  SpecialCondition
} from "shared/src/model/logistics/routePlanning/settings";
import "./index.scss";

interface Props {
  parameters: Parameters;
  readonly: boolean;
}

@observer
export default class SimulationParametersComponent extends React.Component<
  Props
> {
  // tslint:disable-next-line:no-any
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <>
        {this.renderLimitations()}
        <DividerComponent />
        {this.renderLoadingTimes()}
        {this.props.parameters.specialConditions.length > 0 && (
          <>
            <DividerComponent />
            {this.renderSpecialConditions()}
          </>
        )}
      </>
    );
  }

  private renderLimitations() {
    return (
      <>
        <p>Begrænsninger</p>
        <div className="c-routeSimulation-parameters-twoInput">
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="MAX ANTAL RUTER PR. RUTEOPTIMERING"
            valueDescription="ruter"
            value={this.props.parameters.limitations.maximumRoutesCount || undefined}
            onChange={value => {
              this.props.parameters.limitations.maximumRoutesCount = value || 0;
            }}
            error={false}
          />
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="MAX ANTAL STOP PR RUTE"
            valueDescription="stops"
            value={this.props.parameters.limitations.maximumStopPerRouteCount || undefined}
            onChange={value => {
              this.props.parameters.limitations.maximumStopPerRouteCount = value || 0;
            }}
            error={false}
          />
        </div>
        <div className="c-routeSimulation-parameters-threeInput">
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="MAX ANTAL KOLLI"
            valueDescription="kolli"
            value={this.props.parameters.limitations.maximumColliCount || undefined}
            onChange={value => {
              this.props.parameters.limitations.maximumColliCount = value || 0;
            }}
            error={false}
          />
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="MAX TID PR RUTE"
            valueDescription="min"
            value={
              this.props.parameters.limitations.maximumTimePerRoute
                ? Math.round(
                    (this.props.parameters.limitations.maximumTimePerRoute /
                      60) *
                      100
                  ) / 100
                : undefined
            }
            onChange={value => {
              if (value) {
                this.props.parameters.limitations.maximumTimePerRoute =
                  value * 60;
              } else {
                this.props.parameters.limitations.maximumTimePerRoute = 0;
              }
            }}
            error={false}
          />
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="MAX VÆGT"
            valueDescription="kg"
            value={this.props.parameters.limitations.maximumWeight || undefined}
            onChange={value => {
              this.props.parameters.limitations.maximumWeight = value || 0;
            }}
            error={false}
          />
        </div>
        <InputNumbers
          readonly={this.props.readonly}
          size={"medium"}
          headline="START PRIS PR YDERLIGERE RUTE"
          value={this.props.parameters.limitations.startCostOfAdditionalRoute || undefined}
          onChange={value => {
            this.props.parameters.limitations.startCostOfAdditionalRoute = value || 0;
          }}
          error={false}
        />
      </>
    );
  }

  private renderLoadingTimes() {
    return (
      <>
        <p>Læssetider</p>
        <InputNumbers
          readonly={this.props.readonly}
          size={"medium"}
          headline="KOLLI PR. INDBÆRING"
          valueDescription="kolli"
          value={this.props.parameters.loadingTimes.colliCountPerDeliveryRound || undefined}
          onChange={value => {
            this.props.parameters.loadingTimes.colliCountPerDeliveryRound = value || 0;
          }}
          error={false}
        />
        <div className="c-routeSimulation-parameters-twoInput">
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="TID TIL PARKERING"
            valueDescription="sec"
            value={this.props.parameters.loadingTimes.timeForParking || undefined}
            onChange={value => {
              this.props.parameters.loadingTimes.timeForParking = value || 0;
            }}
            error={false}
          />
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="TID PR. INDBÆRING"
            valueDescription="sec"
            value={this.props.parameters.loadingTimes.timePerDeliveryRound || undefined}
            onChange={value => {
              this.props.parameters.loadingTimes.timePerDeliveryRound = value || 0;
            }}
            error={false}
          />
        </div>
        <div className="c-routeSimulation-parameters-twoInput">
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="EKSTRA TID PR. ETAGE PR. INDBÆRING"
            valueDescription="sec"
            value={this.props.parameters.loadingTimes.timePerFloor || undefined}
            onChange={value => {
              this.props.parameters.loadingTimes.timePerFloor = value || 0;
            }}
            error={false}
          />
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="LÆSSETID VED AFHENTNING"
            valueDescription="min"
            value={
              this.props.parameters.loadingTimes.pickupLoadingTime
                ? Math.round(
                    (this.props.parameters.loadingTimes.pickupLoadingTime /
                      60) *
                      100
                  ) / 100
                : undefined
            }
            onChange={value => {
              if (value) {
                this.props.parameters.loadingTimes.pickupLoadingTime =
                  value * 60;
              } else {
                this.props.parameters.loadingTimes.pickupLoadingTime = 0;
              }
            }}
            error={false}
          />
        </div>
      </>
    );
  }

  private renderSpecialConditions() {
    return (
      <>
        <p>Specialle områder</p>
        {this.props.parameters.specialConditions.map(sc =>
          this.renderSpecialCondition(sc)
        )}
      </>
    );
  }

  private renderSpecialCondition(specialCondition: SpecialCondition) {
    return (
      <div
        key={`specialCondition-${specialCondition.id}`}
        className="c-routeSimulation-parameters-specialCondition"
      >
        <WorldMap
          onMapReady={map => this.tryFitBounds(map, specialCondition.area)}
          defaultZoom={5}
          options={{
            disableDefaultUI: true,
            scrollwheel: true
          }}
        >
          <Polygon
            key={`polygon_${specialCondition.id}`}
            path={specialCondition.area.map(p => p.toGoogleLatLngLiteral())}
            options={{
              geodesic: false,
              strokeColor: "#edf2f9",
              fillColor: "rgba(0, 22, 46, 0.5)",
              strokeWeight: 3
            }}
          />
        </WorldMap>

        <div className="c-routeSimulation-parameters-twoInputStacked">
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="EKSTRA LÆSSETID"
            valueDescription="sec"
            value={specialCondition.additionalLoadingTime || undefined}
            onChange={value => {
              specialCondition.additionalLoadingTime = value || 0;
            }}
            error={false}
          />
          <InputNumbers
            readonly={this.props.readonly}
            size={"medium"}
            headline="EKSTRA KØRETID"
            valueDescription="%"
            value={specialCondition.additionalTrafficPercentage || undefined}
            onChange={value => {
              specialCondition.additionalTrafficPercentage = value || 0;
            }}
            error={false}
          />
        </div>
      </div>
    );
  }

  private tryFitBounds(map: GoogleMap, positions: Position[]): void {
    const routeBounds = new google.maps.LatLngBounds();

    for (const position of positions) {
      routeBounds.extend(position.toGoogleLatLng());
    }

    // tslint:disable-next-line:no-any
    (map.fitBounds as Function)(routeBounds, 10);
  }
}
