import { autoinject, containerless, noView, bindable } from "aurelia-framework";
import { CallbackWithContext, GeoJsonPoint } from "shared/types";
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
@noView
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
    public icon: google.maps.ReadonlyIcon | google.maps.ReadonlySymbol | undefined;

    /**
     * The function to call when a `clicked` event is dispatched on the marker.
     */
    @bindable
    public click: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `dblclick` event is dispatched on the marker.
     */
    @bindable
    public dblclick: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `drag` event is dispatched on the marker.
     */
    @bindable
    public drag: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `dragend` event is dispatched on the marker.
     */
    @bindable
    public dragend: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `dragstart` event is dispatched on the marker.
     */
    @bindable
    public dragstart: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `mousedown` event is dispatched on the marker.
     */
    @bindable
    public mousedown: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `mouseout` event is dispatched on the marker.
     */
    @bindable
    public mouseout: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `mouseover` event is dispatched on the marker.
     */
    @bindable
    public mouseover: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `mouseup` event is dispatched on the marker.
     */
    @bindable
    public mouseup: CallbackWithContext<{ event: PointerEvent }>;

    /**
     * The function to call when a `rightclick` event is dispatched on the marker.
     */
    @bindable
    public rightclick: CallbackWithContext<{ event: PointerEvent }>;

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
                this.marker.addListener(eventName as any, event => this[eventName]?.({ event: event.domEvent }));
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
