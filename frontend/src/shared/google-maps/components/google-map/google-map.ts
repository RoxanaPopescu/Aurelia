import { useShadowDOM, autoinject, bindable, bindingMode } from "aurelia-framework";
import { AsyncCallbackWithContext } from "shared/types";
import { GoogleMapsService } from "../../services/google-maps";
import { IGoogleMapObject, IGoogleMapObjectOwner } from "./google-map-object";

/**
 * Represents the type of map being presented.
 */
export type GoogleMapType = google.maps.MapTypeId | "street";

/**
 * Represents a Google Map.
 */
@autoinject
@useShadowDOM
export class GoogleMapCustomElement implements IGoogleMapObjectOwner
{
    /**
     * Creates a new instance of the type.
     * @param googleMapsService The `GoogleMapsService` instance.
     */
    public constructor(googleMapsService: GoogleMapsService)
    {
        this._googleMapsService = googleMapsService;

        // Load the Google Maps API, if not already loaded.
        this._googleMapsPromise = googleMapsService.load();

        // Set the initial component state.
        this._componentState = "detached";
    }

    private readonly _googleMapsService: GoogleMapsService;
    private readonly _googleMapsPromise: Promise<typeof google.maps>;
    private readonly _objects: IGoogleMapObject[] = [];
    private _componentState: "attaching" | "attached" | "detached";

    /**
     * The element to which the map instance is attached.
     */
    protected mapElement: HTMLElement;

    /**
     * The map instance.
     */
    public map: google.maps.Map | undefined;

    /**
     * The function to call before configuring and creating the map.
     * @returns The map options to use.
     */
    @bindable
    public configure: AsyncCallbackWithContext<
    {
        /**
         * The map options to use.
         */
        options: google.maps.MapOptions;

    }, google.maps.MapOptions> | undefined;

    /**
     * The function to call after configuring and creating the map.
     */
    @bindable
    public configured: AsyncCallbackWithContext<
    {
        /**
         * The map instance.
         */
        map: google.maps.Map;

    }> | undefined;

    /**
     * True if the user has interacted with the map, otherwise false.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay, defaultValue: false })
    public touched: boolean;

    /**
     * The type of map being presented, or undefined if the map is not configured yet.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public type: string | google.maps.MapTypeId | "street" | undefined;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Return if the component is already attaching.
        if (this._componentState === "attaching")
        {
            return;
        }

        // Indicate that the component is attaching.
        this._componentState = "attaching";

        // Wait for the Google Maps API to load.
        this._googleMapsPromise

            .then(async googleMaps =>
            {
                // Return if the component was detached while the Google Maps API was loading.
                if (this._componentState === "detached")
                {
                    return;
                }

                // Clone the default options.
                let options = JSON.parse(JSON.stringify(this._googleMapsService.settings.defaults));

                // Call the `configure` callback.
                options = await this.configure?.({ options }) ?? options;

                // Create the map instance.
                this.map = new googleMaps.Map(this.mapElement,
                {
                    backgroundColor: "none",
                    ...options
                });

                // Get the street view panorama associated with the map instance.
                const streetView = this.map.getStreetView();

                // Resolve the initial map type.
                this.type = streetView.getVisible() ? "street" : this.map.getMapTypeId();

                // Detect when the street view visibility is changed.
                googleMaps.event.addListener(streetView, "visible_changed", () =>
                {
                    this.type = streetView.getVisible() ? "street" : this.map!.getMapTypeId();
                });

                // Detect when the map type is changed.
                googleMaps.event.addListener(this.map, "maptypeid_changed", () =>
                {
                    this.type = streetView.getVisible() ? "street" : this.map!.getMapTypeId();
                });

                // Indicate that the component is attached.
                this._componentState = "attached";

                // Attach objects.
                for (const object of this._objects.slice())
                {
                    object.attach();
                }

                // Call the `created` callback.
                await this.configured?.({ map: this.map });
            })

            .catch(error =>
            {
                console.error(error);
            });
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        // Detach objects.
        for (const object of this._objects.slice())
        {
            object.detach();
        }

        // Indicate that the component is detached.
        this._componentState = "detached";
    }

    /**
     * Registers the specified objects as owned by this object.
     */
    public register(...objects: IGoogleMapObject[]): void
    {
        for (const object of objects)
        {
            const index = this._objects.indexOf(object);

            if (index === -1)
            {
                this._objects.push(object);

                if (this._componentState === "attached")
                {
                    object.attach();
                }
            }
        }
    }

    /**
     * Unregisters the specified objects as owned by this object.
     */
    public unregister(...objects: IGoogleMapObject[]): void
    {
        for (const object of objects)
        {
            const index = this._objects.indexOf(object);

            if (index !== -1)
            {
                this._objects.splice(index, 1);

                if (this._componentState === "attached")
                {
                    object.detach();
                }
            }
        }
    }

    /**
     * Called when the user interacts with the map.
     * @returns True to continue processing the event.
     */
    protected onInteraction(): boolean
    {
        // Indicate that the user has interacted with the map.
        this.touched = true;

        return true;
    }
}
