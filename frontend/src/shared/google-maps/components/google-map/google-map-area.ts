import { Container, autoinject, containerless, noView, bindable } from "aurelia-framework";
import { CallbackWithContext, GeoJsonArea } from "shared/types";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";
import { geoJsonGeometryToLatLngLiterals } from "./google-map-utilities";

// The names of the instance events that should be re-dispatched by the component.
const eventNames = ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "dragstart", "drag", "dragend", "contextmenu"];

/**
 * Represents an area on a map.
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
     * The function to call when a `click` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public click: CallbackWithContext<{ event: PointerEvent }, boolean | undefined>;

    /**
     * The function to call when a `dblclick` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public dblclick: CallbackWithContext<{ event: MouseEvent }, boolean | undefined>;

    /**
     * The function to call when a `mousedown` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public mousedown: CallbackWithContext<{ event: MouseEvent }, boolean | undefined>;

    /**
     * The function to call when a `mouseup` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public mouseup: CallbackWithContext<{ event: MouseEvent }, boolean | undefined>;

    /**
     * The function to call when a `mouseover` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public mouseover: CallbackWithContext<{ event: MouseEvent }, boolean | undefined>;

    /**
     * The function to call when a `mouseout` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public mouseout: CallbackWithContext<{ event: MouseEvent }, boolean | undefined>;

    /**
     * The function to call when a `dragstart` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public dragstart: CallbackWithContext<{ event: DragEvent }, boolean | undefined>;

    /**
     * The function to call when a `drag` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public drag: CallbackWithContext<{ event: DragEvent }, boolean | undefined>;

    /**
     * The function to call when a `dragend` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public dragend: CallbackWithContext<{ event: DragEvent }, boolean | undefined>;

    /**
     * The function to call when a `contextmenu` event occurs.
     * @returns False to prevent default, otherwise true or undefined.
     */
    @bindable
    public contextmenu: CallbackWithContext<{ event: PointerEvent }, boolean | undefined>;

    /**
     * Called by the map when the component should attach to the map.
     */
    public attach(): void
    {
        this.instance = new google.maps.Polygon(
        {
            map: this._map.instance,
            geodesic: false,
            paths: geoJsonGeometryToLatLngLiterals(this.area),
            zIndex: this.zIndex,
            clickable: true,
            fillColor: this._map.getCssValue(this.fillColor),
            fillOpacity: this.fillOpacity,
            strokeColor: this._map.getCssValue(this.strokeColor),
            strokeWeight: this.strokeWidth,
            strokeOpacity: this.strokeOpacity
        });

        this._eventListeners = [];

        for (const eventName of eventNames)
        {
            this._eventListeners.push(this.instance.addListener(eventName as any, event =>
            {
                const result = this[eventName]?.({ event: event.domEvent });

                if (result === false)
                {
                    event.domEvent.preventDefault();
                }
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

        if (this.instance != null)
        {
            this.instance.setMap(null);
            this.instance = undefined;

            for (const eventListener of this._eventListeners!)
            {
                eventListener.remove();
            }

            this._eventListeners = undefined;
        }
    }

    /**
     * Called by the framework when the `area` property changes.
     */
    protected areaChanged(): void
    {
        this.instance?.setPaths(geoJsonGeometryToLatLngLiterals(this.area));
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
        this.instance?.setOptions({ fillColor: this._map.getCssValue(this.fillColor) });
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
        this.instance?.setOptions({ strokeColor: this._map.getCssValue(this.strokeColor) });
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
