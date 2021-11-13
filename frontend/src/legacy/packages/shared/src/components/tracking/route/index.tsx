import React from "react";
import "./styles.scss";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
  MarkerProps
} from "react-google-maps";
import MapHelper from "shared/src/utillity/mapHelpers";
import Service from "./service";
import { observable, computed } from "mobx";
import {
  Button,
  InputPhone,
  InputCheckbox,
  ButtonType,
  getMapStyles,
  MapConstants,
  InfoBox
} from "shared/src/webKit";
import Localization from "shared/src/localization";
import Kronos from "react-kronos";
import { observer } from "mobx-react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Moment from "moment";
import H from "history";
import MapHoverArea from "shared/src/components/map/hoverArea";
import { PageHeaderComponent } from "../../pageHeader";
import { PageContentComponent } from "../../pageContent";

interface Props {
  location?: H.Location;
  history?: H.History;
}

enum Controls {
  play,
  pause,
  notPlaying
}

export interface DriverMarker extends MarkerProps {
  timestamp: Moment.Moment;
  key: string;
  // tslint:disable-next-line:no-any
  data: any;
}

export class DriverTrackingStore {
  @observable loading: boolean;
  @observable error?: string;
  @observable validate?: boolean;

  // tslint:disable-next-line:no-any
  map: any;
  @observable markers?: DriverMarker[];
  @observable activeMarkers: DriverMarker[] = [];

  animatedMarker: DriverMarker = MapHelper.driverTrackingMarker(
    { latitude: 0, longitude: 0, timestamp: Moment() },
    "ActiveMarker"
  );
  lastActiveMarkerIndex: number = 0;
  @observable markerHoverIndex?: number;
  mouseOwner?: string;

  @observable selectedPoint: number = 0;

  start: Moment.Moment = Moment();
  end: Moment.Moment = Moment();
  secondsBetweenTicks: number = 0;

  @observable driverId?: string;
  @observable toDate: Moment.Moment;
  @observable toTime: Moment.Moment;
  @observable showAllMarkers: boolean = true;
  @observable playButton: Controls = Controls.notPlaying;
  @observable fromDate: Moment.Moment;
  @observable fromTime: Moment.Moment;

  @observable hoverItem?: DriverMarker;

  @computed
  get currentMarkers(): DriverMarker[] {
    if (store.showAllMarkers) {
      if (store.markers) {
        return store.markers;
      } else {
        return [];
      }
    }

    if (store.activeMarkers === undefined || store.activeMarkers.length <= 0) {
      return [];
    }

    let markerWithCoordinates = store.activeMarkers[0];
    store.animatedMarker.position = markerWithCoordinates.position;
    return [store.animatedMarker];
  }
}
const store = new DriverTrackingStore();
const snakeMarkersMaxCount = 40;
const ticks = 200;
const totalTime = 10.0;
const tickEachMilisecond = (totalTime / ticks) * 1000;

// tslint:disable-next-line:no-any
function polylines(markers: any) {
  var currentAlpha = 0.9;
  return markers.map((marker, index) => {
    if (index === 0) {
      return;
    }

    let path = [
      new google.maps.LatLng(
        markers[index - 1].position.lat,
        markers[index - 1].position.lng
      ),
      new google.maps.LatLng(marker.position.lat, marker.position.lng)
    ];
    currentAlpha = currentAlpha * 0.92;

    return (
      <Polyline
        path={path}
        options={{
          strokeWeight: 2,
          strokeColor: "rgba(20,60,86,1)",
          strokeOpacity: currentAlpha
        }}
        key={"marker-" + marker.timestamp.format("DD-MM-YYYY HH:mm:ss") + index}
      />
    );
  });
}

@observer
class Map extends React.Component<Props> {
  render() {
    return (
      <GoogleMap
        ref={ref => (store.map = ref)}
        defaultZoom={16}
        zoom={16}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          styles: getMapStyles(),
          minZoom: 2,
          maxZoom: 20,
        }}
      >
        {store.activeMarkers && polylines(store.activeMarkers)}
        {store.currentMarkers.map((marker, index) => (
          <Marker
            {...marker}
            onMouseOver={() => {
              store.hoverItem = marker;
            }}
            onClick={() => {
              store.map.panTo(marker.position);
            }}
            key={marker.key}
          />
        ))}

        {store.hoverItem && (
          <InfoWindow
            position={store.hoverItem.position}
            options={{
              disableAutoPan: true,
              pixelOffset: new google.maps.Size(0, -30)
            }}
          >
            <MapHoverArea
              onMouseEnter={owner => {
                if (store.hoverItem) {
                  store.mouseOwner = owner;
                }
              }}
              onMouseLeave={owner => {
                if (store.hoverItem && store.mouseOwner === owner) {
                  store.hoverItem = undefined;
                }
              }}
            >
              <InfoBox
                color={"blue"}
                headline={store.hoverItem.timestamp.format(
                  "DD-MM-YYYY HH:mm:ss"
                )}
                rows={[]}
              />
            </MapHoverArea>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  }
}

const DriverTrackingGoogleMap = withScriptjs(withGoogleMap(Map));

@observer
export default class TrackingRoute extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.getParameters();
    document.title = "Chauffør tracking";
  }

  componentDidMount() {
    if (store.driverId) {
      this.fetchDriverData();
    }
  }

  getParameters() {
    let url = new URL(window.location.href);
    let driverId = url.searchParams.get("driverId");
    let fromDate = url.searchParams.get("fromDate");
    let toDate = url.searchParams.get("toDate");

    if (driverId) {
      store.driverId = driverId;
    }

    if (fromDate) {
      store.fromDate = Moment(fromDate);
      store.fromTime = store.fromDate.clone();
    } else {
      store.fromDate = Moment().subtract(5, "hours");
      store.fromTime = Moment().subtract(5, "hours");
    }

    if (toDate) {
      store.toDate = Moment(toDate);
      store.toTime = store.toDate.clone();
    } else {
      store.toDate = Moment();
      store.toTime = Moment();
    }
  }

  setParameters() {
    if (store.fromTime === undefined) {
      store.fromTime = Moment().subtract(5, "hours");
    }

    let parameters: string[] = [];
    let url: string = this.props.location!.pathname;

    if (store.driverId) {
      parameters.push("driverId=" + store.driverId);
    }

    parameters.push("fromDate=" + store.fromTime.format("YYYY-MM-DD HH:mm"));
    parameters.push("toDate=" + store.toTime.format("YYYY-MM-DD HH:mm"));

    parameters.map((parameter, index) => {
      if (index === 0) {
        url = url + "?" + parameter;
      } else {
        url = url + "&" + parameter;
      }
    });

    this.props.history!.push(url);
  }

  fetchDriverData() {
    if (store.driverId === undefined) {
      store.validate = true;
      return;
    }

    store.loading = true;
    store.markers = undefined;

    let from = store.fromTime.clone();
    let to = store.toTime.clone();

    console.log("DST: ", from.isDST());

    from.add(from.isDST() ? -2 : -1, "hours");
    to.add(from.isDST() ? -2 : -1, "hours");

    Service.driverLocationHistory(
      store.driverId,
      from.format("YYYY-MM-DD HH:mm"),
      to.format("YYYY-MM-DD HH:mm")
    )
      .then(data => {
        let markers: DriverMarker[] = [];

        if (data.coordinates.length > 0) {
          data.coordinates.map(location => {
            let timestamp = Moment(location.timestamp).add(from.isDST() ? 2 : 1, "hours");
            location.timestamp = timestamp;

            markers.push(
              MapHelper.driverTrackingMarker(
                location,
                "marker-" + location.timestamp
              )
            );
          });
        }

        store.markers = markers;
        this.fixCorrectSortingRemoveMe();

        if (markers.length > 0) {
          store.start = store.markers[0].timestamp;
          store.end = store.markers[store.markers.length - 1].timestamp;

          var duration = Moment.duration(store.end.diff(store.start));
          var seconds = duration.asSeconds();
          var num = seconds / ticks;
          store.secondsBetweenTicks = Math.round(num);
        }

        store.selectedPoint = 0;
        if (store.showAllMarkers) {
          this.zoomToAll();
        }

        store.loading = false;
      })
      .catch(error => {
        store.loading = false;
        store.error = error;
      });
  }

  fixCorrectSortingRemoveMe() {
    if (store.markers === undefined || store.markers.length <= 0) {
      return;
    }

    if (
      store.markers[store.markers.length - 1].timestamp.isBefore(
        store.markers[0].timestamp
      )
    ) {
      store.markers = store.markers.slice().reverse();
    }
  }

  // tslint:disable-next-line:no-any
  handleChange(value: any) {
    let value2 = value;
    value = value2;
    // TODO: USE?
  }

  handleChangeComplete() {
    // TODO: USE?
  }

  // tslint:disable-next-line:no-any
  lastActiveMarker: any;

  getFormattedLabel(value: number) {
    if (store.activeMarkers.length > 0) {
      this.lastActiveMarker = store.activeMarkers[0];
      return store.activeMarkers[0].timestamp.format("DD-MM-YYYY HH:mm:ss");
    } else if (this.lastActiveMarker) {
      return this.lastActiveMarker.timestamp.format("DD-MM-YYYY HH:mm:ss");
    } else {
      return "";
    }
  }

  nearestMarkerForTick() {
    if (store.markers === undefined || store.markers.length <= 0) {
      return;
    }

    let newMarker = store.markers[store.lastActiveMarkerIndex];
    var currentDate = store.start.clone();
    currentDate.add("seconds", store.secondsBetweenTicks * store.selectedPoint);

    for (var i = store.lastActiveMarkerIndex; i < store.markers.length; i++) {
      let markerToTest = store.markers[i];
      if (markerToTest.timestamp.isAfter(currentDate)) {
        newMarker = markerToTest;
        store.lastActiveMarkerIndex = i;
        break;
      }
    }

    if (newMarker === store.activeMarkers[0]) {
      return; // Nothing new
    }

    store.activeMarkers.unshift(newMarker);
    store.activeMarkers = store.activeMarkers.slice(
      0,
      Math.min(store.activeMarkers.length, snakeMarkersMaxCount)
    );
    store.map.panTo(newMarker.position);

    store.hoverItem = newMarker;
  }

  getRightImage() {
    return store.playButton === Controls.play
      ? require("./assets/pause.svg")
      : require("./assets/play.svg");
  }

  playThrough() {
    store.showAllMarkers = false;
    store.activeMarkers = [];
    store.hoverItem = undefined;

    if (store.playButton === Controls.notPlaying) {
      store.playButton = Controls.play;
      store.selectedPoint = 0;
      store.lastActiveMarkerIndex = 0;
      this.nextTick();
      return;
    }

    if (store.playButton === Controls.pause) {
      store.playButton = Controls.play;
      this.nextTick();
    } else if (store.playButton === Controls.play) {
      store.playButton = Controls.pause;
    }
  }

  nextTick() {
    if (store.selectedPoint === ticks) {
      store.playButton = Controls.notPlaying;
      store.selectedPoint = ticks;
      return;
    }

    if (store.playButton !== Controls.play) {
      return;
    }

    let self = this;
    setTimeout(() => {
      if (store.markers === undefined || store.selectedPoint === undefined) {
        return;
      }

      store.selectedPoint++;
      self.nearestMarkerForTick();
      self.nextTick();
    }, tickEachMilisecond);
  }

  onChangeDateFrom(date: Moment.Moment) {
    store.fromDate = date;
    if (store.fromTime === undefined) {
      store.fromTime = store.fromDate;
    } else {
      store.fromTime = store.fromTime
        .date(date.date())
        .month(date.month())
        .year(date.year());
    }
  }

  onChangeDateTo(date: Moment.Moment) {
    store.toDate = date;
    if (store.toTime === undefined) {
      store.toTime = store.toDate;
    } else {
      store.toTime = store.toTime
        .date(date.date())
        .month(date.month())
        .year(date.year());
    }
  }

  changeShowAllMarkers(checked: boolean) {
    store.selectedPoint = 0;
    this.lastActiveMarker = undefined;
    store.showAllMarkers = checked;
    store.activeMarkers = [];
    store.playButton = Controls.notPlaying;
    store.hoverItem = undefined;

    if (checked === true) {
      this.zoomToAll();
    }
  }

  zoomToAll() {
    if (store.markers === undefined) {
      return;
    }

    let bounds = new google.maps.LatLngBounds();
    store.markers.forEach(p => {
      bounds.extend(p.position!);
    });

    store.map.fitBounds(bounds);
  }

  render() {
    return (
      <div className="c-driverTacking-driverTrackingWrapper">

        <PageHeaderComponent
          path={[
            { title: Localization.operationsValue("DriverTracking_Rutes_Title") },
            { title: Localization.operationsValue("Menu_Operation_DriverTracking") }
          ]}
        >
          <div className="body secondary c-driverTacking-help">
            {Localization.operationsValue("DriverTracking_DriverIdPlaceholder")}
          </div>
          <InputPhone
            minlength={1}
            placeholder={Localization.operationsValue(
              "DriverTracking_DriverIdPlaceholder"
            )}
            value={store.driverId}
            onChange={value => (store.driverId = value)}
            error={
              store.validate &&
              (store.driverId === undefined || store.driverId.length < 1)
            }
          />
          <div className="body secondary c-driverTacking-help">
            {Localization.sharedValue("Order_TimeFrame_TimeFrom")}
          </div>
          <Kronos
            preventClickOnDateTimeOutsideRange={true}
            readOnly={true}
            date={store.fromDate}
            format="DD. MMM YYYY"
            placeholder={Localization.operationsValue(
              "DriverTracking_DateFromPlaceholder"
            )}
            calendarClassName="c-driverTacking-dateTimeCalendar"
            inputClassName="c-driverTacking-dateTimeInput dateInput"
            returnAs={"MOMENT"}
            options={{
              locale: {
                lang: "da",
                settings: {
                  week: { dow: 1 },
                  weekdaysMin: ["M", "T", "O", "T", "F", "L", "S"]
                }
              }
            }}
            onChangeDateTime={value => this.onChangeDateFrom(value)}
          />
          <Kronos
            readOnly={true}
            time={store.fromTime}
            timeStep={15}
            format={"HH:mm"}
            placeholder={Localization.operationsValue(
              "DriverTracking_TimeFromPlaceholder"
            )}
            calendarClassName="c-driverTacking-timeDropdown"
            inputClassName="c-driverTacking-dateTimeInput timeInput"
            returnAs={"MOMENT"}
            onChangeDateTime={value => (store.fromTime = value)}
          />
          <div className="body secondary c-driverTacking-help">
            {Localization.sharedValue("Order_TimeFrame_TimeTo")}
          </div>
          <Kronos
            preventClickOnDateTimeOutsideRange={true}
            readOnly={true}
            date={store.toDate}
            format="DD. MMM YYYY"
            placeholder={Localization.operationsValue(
              "DriverTracking_DateFromPlaceholder"
            )}
            calendarClassName="c-driverTacking-dateTimeCalendar"
            inputClassName="c-driverTacking-dateTimeInput dateInput"
            returnAs={"MOMENT"}
            options={{
              locale: {
                lang: "da",
                settings: {
                  week: { dow: 1 },
                  weekdaysMin: ["M", "T", "O", "T", "F", "L", "S"]
                }
              }
            }}
            onChangeDateTime={value => this.onChangeDateTo(value)}
          />
          <Kronos
            readOnly={true}
            time={store.toTime}
            timeStep={15}
            format={"HH:mm"}
            placeholder={Localization.operationsValue(
              "DriverTracking_TimeFromPlaceholder"
            )}
            calendarClassName="c-driverTacking-timeDropdown"
            inputClassName="c-driverTacking-dateTimeInput c-driverTacking-timeInput"
            returnAs={"MOMENT"}
            onChangeDateTime={value => (store.toTime = value)}
          />
          <Button
            className="fetchDriver"
            onClick={() => {
              this.setParameters();
              this.fetchDriverData();
            }}
            type={ButtonType.Action}
          >
            {Localization.operationsValue("DriverTracking_FetchButton")}
          </Button>

        </PageHeaderComponent>

        <PageContentComponent>

          <DriverTrackingGoogleMap
            loadingElement={<div />}
            googleMapURL={MapConstants.url("3.35")}
            containerElement={<div className="c-driverTacking-mapContainer" />}
            mapElement={<div style={{ height: "100%", width: "100%" }} />}
          />
          {(store.driverId === undefined ||
            (store.markers && store.markers.length === 0)) && (
            <div className="c-driverTacking-infoView">
              <div className="font-larger primary">
                {store.driverId === undefined
                  ? Localization.operationsValue("DriverTracking_NoDriverId")
                  : Localization.operationsValue("DriverTracking_NoResults")}
              </div>
            </div>
          )}
          <div className="c-driverTacking-sliderOuterContainer">
            <InputRange
              disabled={store.markers === undefined}
              formatLabel={value => this.getFormattedLabel(value)}
              minValue={0}
              maxValue={ticks}
              draggableTrack={true}
              value={store.selectedPoint}
              onChange={value => this.handleChange(value)}
              onChangeComplete={() => this.handleChangeComplete()}
            />
            <img
              src={this.getRightImage()}
              onClick={() => {
                this.playThrough();
              }}
              className={
                store.markers === undefined
                  ? "c-driverTacking-playButton disabled"
                  : "c-driverTacking-playButton"
              }
            />
            <InputCheckbox
              className="c-driverTracking-checkbox"
              checked={store.showAllMarkers}
              onChange={checked => this.changeShowAllMarkers(checked)}
            >
              {Localization.operationsValue("DriverTracking_ShowAllMarkers")}
            </InputCheckbox>
          </div>
          {store.loading && (
            <div className="c-driverTacking-loader">
              <div className="font-larger primary">
                {Localization.sharedValue("General_Loading")}
              </div>
            </div>
          )}
          {store.markers &&
            store.markers.length === 0 && (
              <div>
                <div className="font-larger primary">Ingen resultater</div>
              </div>
            )}

        </PageContentComponent>

      </div>
    );
  }
}
