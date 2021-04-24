import { GeoJsonPoint } from "shared/types";

export function geoJsonPointToLatLng(geoJsonPoint: GeoJsonPoint): google.maps.LatLng
{
    return new google.maps.LatLng(geoJsonPoint.coordinates[0], geoJsonPoint.coordinates[1]);
}
