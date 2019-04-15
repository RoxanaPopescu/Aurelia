import Moment from "moment";
// tslint:disable-next-line:no-any
type onClickCallback = () => any;

export default class MapHelper {
  static polylineDashed(coordinates: { lat: number; lng: number }[]) {
    return {
      key: "polyline",
      path: coordinates,
      options: {
        geodesic: false,
        strokeColor: "#444444",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        opacity: 1,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 0.4,
              scale: 2
            },
            offset: "0",
            repeat: "8px"
          }
        ]
      }
    };
  }

  static circleSearchingRadius(
    coordinate: { lat: number; lng: number },
    radius: number
  ) {
    return {
      center: coordinate,
      radius: radius,
      options: {
        strokeColor: "#42a5f5",
        strokeOpacity: 0.59,
        strokeWeight: 2,
        fillColor: "#42a5f5",
        fillOpacity: 0.1
      }
    };
  }

  static driverTrackingMarker(
    location: {
      latitude: number;
      longitude: number;
      timestamp: Moment.Moment;
    },
    key: string,
    onClick?: onClickCallback
  ) {
    return {
      position: { lat: location.latitude, lng: location.longitude },
      key: key + "_time",
      icon: require("../assets/map/driver.png"),
      onClick: onClick,
      animation: undefined,
      data: location,
      timestamp: location.timestamp
    };
  }
}
