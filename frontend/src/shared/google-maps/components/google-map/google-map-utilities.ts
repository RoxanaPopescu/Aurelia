import { GeoJsonGeometry, GeoJsonPoint } from "shared/types";

/**
 * Gets the specified CSS color value, of if a variable name is specified, the value of the variable.
 * @param mapViewModel The `GoogleMapCustomElement` instance representing the map.
 * @param cssColorOrVariable The CSS color value or variable name to resolve.
 * @returns The specified CSS color value, of if a variable name is specified, the value of the variable.
 */
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

/**
 * Converts the specified point to its equivalent representation in Google Maps.
 * @param geoJsonPoint The point to convert.
 * @returns The `google.maps.LatLng` instance representing the point.
 */
export function geoJsonPointToLatLng(geoJsonPoint: GeoJsonPoint): google.maps.LatLng
{
    return geoJsonCoordinatesToLatLngs(geoJsonPoint.coordinates);
}

/**
 * Converts the specified point to its equivalent representation in Google Maps.
 * @param geoJsonPoint The point to convert.
 * @returns The `google.maps.LatLng` instance representing the point.
 */
export function geoJsonPointToLatLngLiteral(geoJsonPoint: GeoJsonPoint): google.maps.LatLngLiteral
{
    return geoJsonCoordinatesToLatLngLiterals(geoJsonPoint.coordinates);
}

/**
 * Converts the specified geometry to its equivalent representation in Google Maps.
 * @param geoJsonPoint The geometry to convert.
 * @returns An array of `google.maps.LatLng` instances representing the geometry,
 * or a single `google.maps.LatLng` instance if the geometry represents a point.
 */
export function geoJsonGeometryToLatLngs(geoJson: GeoJsonGeometry): (google.maps.LatLng & google.maps.LatLng) | google.maps.LatLng[]
{
    return geoJsonCoordinatesToLatLngs(geoJson.coordinates);
}

/**
 * Converts the specified geometry to its equivalent representation in Google Maps.
 * @param geoJsonPoint The geometry to convert.
 * @returns An array of `google.maps.LatLng` instances representing the geometry,
 * or a single `google.maps.LatLng` instance if the geometry represents a point.
 */
export function geoJsonGeometryToLatLngLiterals(geoJson: GeoJsonGeometry): google.maps.LatLngLiteral[]
{
    return geoJsonCoordinatesToLatLngLiterals(geoJson.coordinates);
}

/**
 * Converts the specified coordinates to their equivalent representation in Google Maps.
 * @param geoJsonCoordinates The coordinates to convert.
 * @returns An array of `google.maps.LatLng` instances representing the geometry,
 * or a single `google.maps.LatLng` instance if the geometry represents a point.
 */
function geoJsonCoordinatesToLatLngs(geoJsonCoordinates: any): any
{
    if (typeof geoJsonCoordinates[0] === "number")
    {
        return new google.maps.LatLng(geoJsonCoordinates[1], geoJsonCoordinates[0]);
    }

    return geoJsonCoordinates.map(c => geoJsonCoordinatesToLatLngs(c));
}

/**
 * Converts the specified coordinates to their equivalent representation in Google Maps.
 * @param geoJsonCoordinates The coordinates to convert.
 * @returns An array of `google.maps.LatLng` instances representing the geometry,
 * or a single `google.maps.LatLng` instance if the geometry represents a point.
 */
function geoJsonCoordinatesToLatLngLiterals(geoJsonCoordinates: any): any
{
    if (typeof geoJsonCoordinates[0] === "number")
    {
        return { lat: geoJsonCoordinates[1], lng: geoJsonCoordinates[0] };
    }

    return geoJsonCoordinates.map(c => geoJsonCoordinatesToLatLngLiterals(c));
}
