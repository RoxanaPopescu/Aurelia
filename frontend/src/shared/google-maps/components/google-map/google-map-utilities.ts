import { GeoJsonGeometry, GeoJsonPoint } from "shared/types";

export function resolveColorString(mapViewModel: any, cssColorOrVariable: string): any
{
    const element = mapViewModel.mapElement;

    if (cssColorOrVariable.startsWith("--"))
    {
        if (element[cssColorOrVariable] == null)
        {
            element[cssColorOrVariable] = getComputedStyle(element).getPropertyValue(cssColorOrVariable);
        }

        return element[cssColorOrVariable];
    }

    return cssColorOrVariable;
}

export function geoJsonPointToLatLng(geoJsonPoint: GeoJsonPoint): google.maps.LatLng
{
    return new google.maps.LatLng(geoJsonPoint.coordinates[1], geoJsonPoint.coordinates[0]);
}

export function geoJsonGeometryToLatLngs(geoJson: GeoJsonGeometry): any
{
    return geoJsonCoordinatesToLatLngs(geoJson.coordinates);
}

function geoJsonCoordinatesToLatLngs(geoJsonCoordinates: any): any
{
    if (typeof geoJsonCoordinates[0] === "number")
    {
        return new google.maps.LatLng(geoJsonCoordinates[1], geoJsonCoordinates[0]);
    }

    return geoJsonCoordinates.map(c => geoJsonCoordinatesToLatLngs(c));
}
