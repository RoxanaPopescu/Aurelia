import { Container, autoinject, containerless, noView, bindable } from "aurelia-framework";
import { CallbackWithContext, GeoJsonArea } from "shared/types";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";
import { geoJsonGeometryToLatLngs, resolveColorString } from "./google-map-utilities";

// The names of the mouse events on the marker that should be re-dispatched from the element.
const eventNames = ["click", "dblclick", "drag", "dragend", "dragstart", "mousedown", "mouseout", "mouseover", "mouseup", "rightclick"];

/**
 * Represents a line on a map.
 */
@autoinject
@containerless
@noView
export class GoogleMapAreaCustomElement extends GoogleMapObject<google.maps.Polygon>
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
     * The area.
     */
    @bindable
    public area: GeoJsonArea;

    /**
     * The z-index of the object.
     */
    @bindable
    public zIndex: number | undefined;

    /**
     * The fill color, as a CSS color string.
     */
    @bindable({ defaultValue: "#000000" })
    public fillColor: string;

    /**
     * The fill opacity, which must be in the range [0, 1].
     */
    @bindable({ defaultValue: 0.5 })
    public fillOpacity: number;

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
        this.instance = new google.maps.Polygon(
        {
            map: this._map.instance,
            geodesic: false,
            paths: geoJsonGeometryToLatLngs(this.area),
            zIndex: this.zIndex,
            clickable: true,
            fillColor: resolveColorString(this._map, this.fillColor),
            fillOpacity: this.fillOpacity,
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
     * Called by the framework when the `area` property changes.
     */
    protected areaChanged(): void
    {
        this.instance?.setPaths(geoJsonGeometryToLatLngs(this.area));
    }

    /**
     * Called by the framework when the `zIndex` property changes.
     */
    protected zIndexChanged(): void
    {
        this.instance?.setOptions({ zIndex: this.zIndex });
    }

    /**
     * Called by the framework when the `fillColor` property changes.
     */
    protected fillColorChanged(): void
    {
        this.instance?.setOptions({ fillColor: resolveColorString(this._map, this.fillColor) });
    }

    /**
     * Called by the framework when the `fillOpacity` property changes.
     */
    protected fillOpacityChanged(): void
    {
        this.instance?.setOptions({ fillOpacity: this.fillOpacity });
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
