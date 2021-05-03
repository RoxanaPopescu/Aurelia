import { Container, autoinject, containerless, noView, bindable } from "aurelia-framework";
import { CallbackWithContext, GeoJsonPoint } from "shared/types";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";
import { geoJsonPointToLatLng, resolveColorString } from "./google-map-utilities";

// The names of the mouse events on the marker that should be re-dispatched from the element.
const eventNames = ["click", "dblclick", "drag", "dragend", "dragstart", "mousedown", "mouseout", "mouseover", "mouseup", "rightclick"];

/**
 * Represents a line on a map.
 */
@autoinject
@containerless
@noView
export class GoogleMapLineCustomElement extends GoogleMapObject<google.maps.Polyline>
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
     * The points on the line.
     */
    @bindable
    public points: GeoJsonPoint[];

    /**
     * The z-index of the object.
     */
    @bindable
    public zIndex: number | undefined;

    /**
     * The icons to use for the object.
     */
    @bindable
    public icons: google.maps.IconSequence[] | undefined;

    /**
     * The stroke color, as a CSS color string.
     */
    @bindable({ defaultValue: "#000000" })
    public strokeColor: string;

    /**
     * The stroke width, in pixels.
     */
    @bindable({ defaultValue: 1 })
    public strokeWidth: number;

    /**
     * The stroke opacity, which must be in the range [0, 1].
     */
    @bindable({ defaultValue: 1 })
    public strokeOpacity: number;

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
        this.instance = new google.maps.Polyline(
        {
            map: this._map.instance,
            geodesic: false,
            path: this.points.map(p => geoJsonPointToLatLng(p)),
            zIndex: this.zIndex,
            clickable: true,
            icons: this.icons,
            strokeColor: resolveColorString(this._map, this.strokeColor),
            strokeWeight: this.strokeWidth,
            strokeOpacity: this.strokeOpacity
        });

        this._eventListeners = [];

        for (const eventName of eventNames)
        {
            this._eventListeners.push(this.instance.addListener(eventName as any, event =>
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
     * Called by the framework when the `points` property changes.
     */
    protected pointsChanged(): void
    {
        this.instance?.setPath(this.points.map(p => geoJsonPointToLatLng(p)));
    }

    /**
     * Called by the framework when the `zIndex` property changes.
     */
    protected zIndexChanged(): void
    {
        this.instance?.setOptions({ zIndex: this.zIndex });
    }

    /**
     * Called by the framework when the `icon` property changes.
     */
    protected iconsChanged(): void
    {
        this.instance?.setOptions({ icons: this.icons });
    }

    /**
     * Called by the framework when the `strokeColor` property changes.
     */
    protected strokeColorChanged(): void
    {
        this.instance?.setOptions({ strokeColor: resolveColorString(this._map, this.strokeColor) });
    }

    /**
     * Called by the framework when the `strokeWidth` property changes.
     */
    protected strokeWidthChanged(): void
    {
        this.instance?.setOptions({ strokeWeight: this.strokeWidth });
    }

    /**
     * Called by the framework when the `strokeOpacity` property changes.
     */
    protected strokeOpacityChanged(): void
    {
        this.instance?.setOptions({ strokeOpacity: this.strokeOpacity });
    }
}
