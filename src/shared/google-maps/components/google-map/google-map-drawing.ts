import { Container, autoinject, containerless, noView, bindable } from "aurelia-framework";
import { CallbackWithContext, GeoJsonPolygon } from "shared/types";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";
import { polygonToGeoJsonPolygon } from "./google-map-utilities";

/**
 * Represents a drawing on a map.
 */
@autoinject
@containerless
@noView
export class GoogleMapDrawingCustomElement extends GoogleMapObject<google.maps.drawing.DrawingManager>
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
     * The function to call when a drawing is completed.
     */
    @bindable
    public complete: CallbackWithContext<{ polygon: GeoJsonPolygon }>;

    /**
     * Called by the map when the component should attach to the map.
     */
    public attach(): void
    {
        this.instance = new google.maps.drawing.DrawingManager(
        {
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            polygonOptions:
            {
                geodesic: false,
                editable: true,
                clickable: false,
                zIndex: this.zIndex,
                fillColor: this._map.getCssValue(this.fillColor),
                fillOpacity: this.fillOpacity,
                strokeColor: this._map.getCssValue(this.strokeColor),
                strokeWeight: this.strokeWidth,
                strokeOpacity: this.strokeOpacity
            }
          });

        this.instance.setMap(this._map.instance!);

        this._eventListeners = [];

        this._eventListeners.push(this.instance.addListener("overlaycomplete", event =>
        {
            event.overlay.setMap(null);

            this.complete?.({ polygon: polygonToGeoJsonPolygon(event.overlay) });
        }));

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
     * Called by the framework when the `zIndex` property changes.
     */
    protected zIndexChanged(): void
    {
        this.instance?.setOptions({ polygonOptions: { zIndex: this.zIndex }});
    }

    /**
     * Called by the framework when the `fillColor` property changes.
     */
    protected fillColorChanged(): void
    {
        this.instance?.setOptions({ polygonOptions: { fillColor: this._map.getCssValue(this.fillColor) }});
    }

    /**
     * Called by the framework when the `fillOpacity` property changes.
     */
    protected fillOpacityChanged(): void
    {
        this.instance?.setOptions({ polygonOptions: { fillOpacity: this.fillOpacity }});
    }

    /**
     * Called by the framework when the `strokeColor` property changes.
     */
    protected strokeColorChanged(): void
    {
        this.instance?.setOptions({ polygonOptions: { strokeColor: this._map.getCssValue(this.strokeColor) }});
    }

    /**
     * Called by the framework when the `strokeWidth` property changes.
     */
    protected strokeWidthChanged(): void
    {
        this.instance?.setOptions({ polygonOptions: { strokeWeight: this.strokeWidth }});
    }

    /**
     * Called by the framework when the `strokeOpacity` property changes.
     */
    protected strokeOpacityChanged(): void
    {
        this.instance?.setOptions({ polygonOptions: { strokeOpacity: this.strokeOpacity }});
    }
}
