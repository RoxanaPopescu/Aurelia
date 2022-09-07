import { GeoJsonGeometry, GeoJsonPoint } from "shared/types";

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

export type GoogleMapsPane =

    /**
     * Pane 0.
     * This pane is the lowest pane and is above the tiles.
     * It does not receive DOM events.
     */
    "mapPane" |

    /**
     * Pane 1.
     * This pane contains polylines, polygons, ground overlays and tile layer overlays.
     * It does not receive DOM events.
     */
     "overlayLayer" |

    /**
     * Pane 2.
     * This pane contains markers.
     * It does not receive DOM events.
     */
    "markerLayer" |

    /**
     * Pane 3.
     * This pane contains elements that receive DOM events.
     */
    "overlayMouseTarget" |

    /**
     * Pane 4.
     * This pane contains the info window.
     * It is above all map overlays.
     */
    "floatPane";

/**
 * Represents an overlay on a map.
 */
export interface IHtmlOverlayView extends google.maps.OverlayView
{
    /**
     * Gets the element representing the overlay.
     * @returns The element representing the overlay.
     */
    get element(): HTMLElement;

    /**
     * Gets the position of the overlay.
     * @returns The position of the overlay.
     */
    get position(): google.maps.LatLng;

    /**
     * Sets the position of the overlay.
     * @param value The position of the overlay.
     */
    set position(value: google.maps.LatLng);

    /**
     * Gets the z-index of the overlay.
     * @returns The z-index of the overlay, or undefined if using the default.
     */
    get zIndex(): number | undefined;

    /**
     * Sets the z-index of the overlay.
     * @param value The z-index of the overlay, or undefined to use the default.
     */
    set zIndex(value: number | undefined);
}

/**
 * Represents the options for an overlay on a map.
 */
export interface IHtmlOverlayViewOptions
{
    /**
     * The element representing the overlay.
     */
    element: HTMLElement;

    /**
     * The position of the overlay.
     */
    position: google.maps.LatLng;

    /**
     * The z-index of the overlay, or undefined to use the default.
     */
    zIndex?: number;

    /**
     * The pane on which the overlay should be rendered, or undefined to use the default.
     */
    pane?: GoogleMapsPane;

    /**
     * The map instance on which the overlay should be presented.
     */
    map?: google.maps.Map;

    /**
     * The function to call after the overlay has been drawn for the first time.
     */
    ready?: () => void;
}

/**
 * Creates a new instance of the `HtmlOverlayView` type.
 * @param options The options to use for the overlay.
 */
export function createHtmlOverlayView(options: IHtmlOverlayViewOptions): IHtmlOverlayView
{
    /**
     * Creates a new instance of the type.
     * @param options The options to use for the overlay.
     */
    class HtmlOverlayView extends google.maps.OverlayView implements IHtmlOverlayView
    {
        // tslint:disable-next-line: no-shadowed-variable
        public constructor(options: IHtmlOverlayViewOptions)
        {
            super();

            this._element = options.element;
            this._pane = options.pane ?? "overlayMouseTarget";
            this._readyFunc = options.ready;
            this._position = options.position;
            this._zIndex = options.zIndex;

            // Prevent interactions from bubbling up to the map.
            HtmlOverlayView.preventMapHitsAndGesturesFrom(this._element);

            if (options.map != null)
            {
                this.setMap(options.map);
            }
        }

        private readonly _element: HTMLElement;
        private readonly _pane: GoogleMapsPane;
        private readonly _readyFunc: (() => void) | undefined;
        private _position: google.maps.LatLng;
        private _zIndex: number | undefined;
        private _ready = false;

        /**
         * Gets the element representing the overlay.
         * @returns The element representing the overlay.
         */
        public get element(): HTMLElement
        {
            return this._element;
        }

        /**
         * Gets the position of the overlay.
         * @returns The position of the overlay.
         */
        public get position(): google.maps.LatLng
        {
            return this._position;
        }

        /**
         * Sets the position of the overlay.
         * @param value The position of the overlay.
         */
        public set position(value: google.maps.LatLng)
        {
            this._position = value;
            this.draw();
        }

        /**
         * Gets the z-index of the overlay.
         * @returns The z-index of the overlay, or undefined if using the default.
         */
        public get zIndex(): number | undefined
        {
            return this._zIndex;
        }

        /**
         * Sets the z-index of the overlay.
         * @param value The z-index of the overlay, or undefined to use the default.
         */
        public set zIndex(value: number | undefined)
        {
            this._zIndex = value;
            this.draw();
        }

        /**
         * Called by Google Maps when the overlay is added to the map.
         */
        public onAdd(): void
        {
            this.getPanes()[this._pane].appendChild(this._element);
        }

        /**
         * Called by Google Maps when the overlay is removed from the map.
         */
        public onRemove(): void
        {
            this._element.remove();
        }

        /**
         * Called by Google Maps each frame when the overlay needs to draw itself.
         */
        public draw(): void
        {
            const elementOffset = this.getProjection().fromLatLngToDivPixel(this._position);

            this._element.style.left = `${elementOffset.x}px`;
            this._element.style.top = `${elementOffset.y}px`;
            this._element.style.zIndex = `${this._zIndex ?? ""}`;

            if (!this._ready)
            {
                this._ready = true;
                this._readyFunc?.();
            }
        }
    }

    return new HtmlOverlayView(options);
}
