import { autoinject, containerless, bindable, computedFrom } from "aurelia-framework";
import { Callback, GeoJsonPoint } from "shared/types";
import { Position } from "app/model/shared";

/**
 * Represents a map feature that presents a segment of the path driven by the driver.
 */
@autoinject
@containerless
export class RouteDriverPathSegmentMapFeatureCustomElement
{
    /**
     * The position representing the beginning of the leg.
     */
     @bindable
    public fromPosition: Position;

    /**
     * The position representing the end of the leg.
     */
    @bindable
    public toPosition: Position;

    /**
     * The function to call when the segment is clicked, if any.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public onClick: Callback<boolean | undefined> | undefined;

    /**
     * Gets the points representing the beginning and end of the segment, if available.
     */
    @computedFrom("fromPosition.position", "toPosition.position")
    protected get points(): GeoJsonPoint[]
    {
        return [this.fromPosition.toGeoJsonPoint(), this.toPosition.toGeoJsonPoint()];
    }
}
