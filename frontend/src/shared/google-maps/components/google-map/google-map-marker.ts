import { Container, autoinject, containerless, noView, bindable } from "aurelia-framework";
import { CallbackWithContext, GeoJsonPoint } from "shared/types";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";
import { geoJsonPointToLatLng } from "./google-map-utilities";

// The names of the mouse events on the marker that should be re-dispatched from the element.
const eventNames = ["click", "dblclick", "drag", "dragend", "dragstart", "mousedown", "mouseout", "mouseover", "mouseup", "rightclick"];

/**
 * Represents a marker on a map.
 */
@autoinject
@containerless
@noView
export class GoogleMapMarkerCustomElement extends GoogleMapObject<google.maps.Marker>
{
    /**
     * Creates a new instance of the type.
     * @param map The `GoogleMapCustomElement` instance owning the component.
     * @param container The `Container` instance associated with the component.
     */
    public constructor(map: GoogleMapCustomElement, container?: Container)
    {
        super(map);

        container?.registerInstance(GoogleMapObject, this);

        this._map = map;
    }

    private readonly _map: GoogleMapCustomElement;
    private _eventListeners: google.maps.MapsEventListener[] | undefined;

    /**
     * The point at which the marker is located.
     */
    @bindable
    public point: GeoJsonPoint;

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
     * The label of the marker.
     */
    @bindable
    public label: string | google.maps.MarkerLabel | undefined;

    /**
     * The title of the marker.
     */
    @bindable
    public title: string | undefined;

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
        this.instance = new google.maps.Marker(
        {
            map: this._map.instance,
            position: geoJsonPointToLatLng(this.point),
            label: this.label,
            title: this.title,
            zIndex: this.zIndex,
            clickable: true,
            icon: this.icon
        });

        this._eventListeners = [];

        for (const eventName of eventNames)
        {
            this._eventListeners.push(this.instance.addListener(eventName as any, (event: any) =>
            {
                this[eventName]?.({ event: event.domEvent });
            }));
        }

        super.attach();
    }

    /**
     * Called by the map when the component should detach from the map.
     */
    public detach(): void
    {
        super.detach();

        this.instance?.setMap(null);
        this.instance = undefined;

        for (const eventListener of this._eventListeners!)
        {
            eventListener.remove();
        }

        this._eventListeners = undefined;
    }

    /**
     * Called by the framework when the `position` property changes.
     */
    protected positionChanged(): void
    {
        this.instance?.setPosition(geoJsonPointToLatLng(this.point));
    }

    /**
     * Called by the framework when the `zIndex` property changes.
     */
    protected zIndexChanged(): void
    {
        this.instance?.setZIndex(this.zIndex || null);
    }

    /**
     * Called by the framework when the `icon` property changes.
     */
    protected iconChanged(): void
    {
        this.instance?.setIcon(this.icon || null);
    }

    /**
     * Called by the framework when the `title` property changes.
     */
    protected titleChanged(): void
    {
        this.instance?.setTitle(this.title || null);
    }
}
