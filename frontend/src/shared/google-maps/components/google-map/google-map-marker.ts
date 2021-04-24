import { autoinject, containerless, view, bindable } from "aurelia-framework";
import { GeoJsonPoint } from "shared/types";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";
import { geoJsonPointToLatLng } from "./utilities/geo-json-helper";

// The names of the mouse events on the marker that should be re-dispatched from the element.
const eventNames = ["click", "dblclick", "drag", "dragend", "dragstart", "mousedown", "mouseout", "mouseover", "mouseup", "rightclick"];

/**
 * Represents a marker on a map.
 */
@autoinject
@containerless
@view("<template></template>")
export class GoogleMapMarkerCustomElement extends GoogleMapObject
{
    /**
     * Creates a new instance of the type.
     * @param map The `GoogleMapCustomElement` instance owning the component.
     */
    public constructor(map: GoogleMapCustomElement, element?: Element)
    {
        super(map);

        this.element = element;
        this.map = map;
    }

    protected readonly map: GoogleMapCustomElement;
    protected readonly element: Node | undefined;

    public marker: google.maps.Marker | undefined;

    /**
     * The point at which the marker is located.
     */
    @bindable
    public point: GeoJsonPoint;

    /**
     * The title of the marker.
     */
    @bindable
    public title: string | undefined;

    /**
     * The z-index of the marker.
     */
    @bindable
    public zIndex: number | undefined;

    /**
     * The icon to use for the marker.
     */
    @bindable
    public icon: any | undefined;

    /**
     * Called by the map when the component should attach to the map.
     */
    public attach(): void
    {
        this.marker = new google.maps.Marker(
        {
            map: this.map.map,
            position: geoJsonPointToLatLng(this.point),
            title: this.title,
            zIndex: this.zIndex,
            clickable: false,
            icon: this.icon
        });

        if (this.element != null)
        {
            for (const eventName of eventNames)
            {
                // TODO: Fix this
                // tslint:disable-next-line: deprecation
                // this.marker.addListener(eventName, event => this.element!.dispatchEvent(event.domEvent));
                this.marker.addListener(eventName, event => console.log("TODO: Dispatch event:", eventName));
            }
        }

        super.attach();
    }

    /**
     * Called by the map when the component should detach from the map.
     */
    public detach(): void
    {
        super.detach();

        this.marker?.setMap(null);
        this.marker = undefined;
    }

    /**
     * Called by the framework when the `position` property changes.
     */
    protected positionChanged(): void
    {
        this.marker?.setPosition(geoJsonPointToLatLng(this.point));
    }

    /**
     * Called by the framework when the `title` property changes.
     */
    protected titleChanged(): void
    {
        this.marker?.setTitle(this.title || null);
    }

    /**
     * Called by the framework when the `zIndex` property changes.
     */
    protected zIndexChanged(): void
    {
        this.marker?.setZIndex(this.zIndex || null);
    }

    /**
     * Called by the framework when the `icon` property changes.
     */
    protected iconChanged(): void
    {
        this.marker?.setIcon(this.icon || null);
    }
}
