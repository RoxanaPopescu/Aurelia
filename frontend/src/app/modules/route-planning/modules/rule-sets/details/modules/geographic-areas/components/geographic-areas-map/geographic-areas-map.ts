import { autoinject, bindable } from "aurelia-framework";
import { GoogleMapCustomElement, GoogleMapType } from "shared/google-maps";
import { SpecialArea } from "app/model/_route-planning-settings";
import { Callback, CallbackWithContext, GeoJsonPolygon } from "shared/types";

@autoinject
export class GeographicAreasMapCustomElement
{
    private _hasFittedBounds = false;

    /**
     * The map view model.
     */
    protected mapViewModel: GoogleMapCustomElement;

    /**
     * The map instance.
     */
    protected mapInstance: google.maps.Map;

    /**
     * True if the user has interacted with the map, otherwise false.
     */
    protected mapTouched: boolean;

    /**
     * The type of map being presented, or undefined if the map is not ready yet.
     */
    protected mapType: GoogleMapType | undefined;

    /**
     * The areas to present, if any.
     */
    @bindable
    public areas: SpecialArea[] | undefined;

    /**
     * The function to call when an area is clicked.
     */
    @bindable
    public areaClick: CallbackWithContext<{ area: SpecialArea }>;

    /**
     * True to enable drawing, otherwise false.
     */
    @bindable({ defaultValue: false })
    public enableDrawing: boolean;

    /**
     * The function to call when a drawing is completed.
     */
    @bindable
    public drawingCompleted: CallbackWithContext<{ polygon: GeoJsonPolygon }>;

    /**
     * The function to call when a drawing is cancelled.
     */
    @bindable
    public drawingCancelled: Callback;

    /**
     * Called by the framework when the component is detached from the DOM.
     */
    public detached(): void
    {
        this._hasFittedBounds = false;
        this.mapViewModel = undefined as any;
        this.mapInstance = undefined as any;
        this.mapTouched = undefined as any;
        this.mapType = undefined as any;
    }

    /**
     * Called by the `google-map` component when the map is being configured.
     * @param options The map options to use.
     */
    protected onMapConfigure(options: google.maps.MapOptions): void
    {
        options.disableDoubleClickZoom = true;
    }

    /**
     * Called by the `google-map` component when the map has been created.
     * @param map The map instance.
     */
    protected onMapConfigured(mapInstance: google.maps.Map): void
    {
        this.mapInstance = mapInstance;

        if (!this._hasFittedBounds && !this.mapTouched)
        {
            this.tryFitBounds();
        }
    }

    /**
     * Called by the framework when the `areas` property changes.
     */
    protected areasChanged(): void
    {
        if (!this._hasFittedBounds && !this.mapTouched)
        {
            setTimeout(() => this.tryFitBounds(), 150);
        }
    }

    /**
     * Attempts to fit the map bounds based on the data being presented.
     */
    protected tryFitBounds(): void
    {
        if (this.mapInstance == null || this.areas == null)
        {
            return;
        }

        const bounds = new google.maps.LatLngBounds();

        if (this.areas != null)
        {
            for (const area of this.areas)
            {
                for (const pos of area.polygon.coordinates[0])
                {
                    bounds.extend({ lng: pos[0], lat: pos[1] });
                }
            }
        }

        if (!bounds.isEmpty())
        {
            this.mapInstance.fitBounds(bounds, { bottom: 60, left: 100, right: 200, top: 80 });
        }

        this._hasFittedBounds = true;
    }
}
