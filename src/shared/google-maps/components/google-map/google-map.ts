import {
  useShadowDOM,
  autoinject,
  bindable,
  bindingMode,
} from 'aurelia-framework';
import { AsyncCallbackWithContext } from 'shared/types';
import { GoogleMapsService } from '../../services/google-maps';
import { IGoogleMapObject, IGoogleMapObjectOwner } from './google-map-object';

/**
 * Represents the type of map being presented.
 */
export type GoogleMapType = google.maps.MapTypeId | 'street';

/**
 * Represents a map.
 */
@autoinject
@useShadowDOM({ mode: 'closed' })
export class GoogleMapCustomElement implements IGoogleMapObjectOwner {
  /**
   * Creates a new instance of the type.
   * @param googleMapsService The `GoogleMapsService` instance.
   */
  public constructor(googleMapsService: GoogleMapsService) {
    this._googleMapsService = googleMapsService;

    // Load the Google Maps API, if not already loaded.
    this._googleMapsPromise = googleMapsService.load();

    // Set the initial component state.
    this.state = 'detached';
  }

  private readonly _googleMapsService: GoogleMapsService;
  private readonly _googleMapsPromise: Promise<typeof google.maps>;
  private readonly _objects: IGoogleMapObject[] = [];

  /**
   * The state of the component.
   */
  protected state: 'detached' | 'attaching' | 'attached' | 'ready';

  /**
   * The element to which the map instance is attached.
   */
  protected mapElement: HTMLElement;

  /**
   * The map instance.
   */
  public instance: google.maps.Map | undefined;

  /**
   * The function to call before configuring and creating the map.
   * @returns The map options to use.
   */
  @bindable
  public configure:
    | AsyncCallbackWithContext<
        {
          /**
           * The map options to use.
           */
          options: google.maps.MapOptions;
        },
        google.maps.MapOptions
      >
    | undefined;

  /**
   * The function to call after configuring and creating the map.
   */
  @bindable
  public configured:
    | AsyncCallbackWithContext<{
        /**
         * The map instance.
         */
        map: google.maps.Map;
      }>
    | undefined;

  /**
   * True if the user has interacted with the map, otherwise false.
   */
  @bindable({ defaultBindingMode: bindingMode.twoWay, defaultValue: false })
  public touched: boolean;

  /**
   * The type of map being presented, or undefined if the map is not configured yet.
   */
  @bindable({ defaultBindingMode: bindingMode.fromView })
  public type: string | google.maps.MapTypeId | 'street' | undefined;

  /**
   * Called by the framework when the component is attached.
   */
  public attached(): void {
    // Return if the component is already attaching.
    if (this.state === 'attaching') {
      return;
    }

    // Indicate that the component is attaching.
    this.state = 'attaching';

    // Wait for the Google Maps API to load.
    this._googleMapsPromise

      .then(async (googleMaps) => {
        // Return if the component was detached while the Google Maps API was loading.
        if (this.state === 'detached') {
          return;
        }

        // Clone the default options.
        let options = JSON.parse(
          JSON.stringify(this._googleMapsService.settings.defaults)
        );

        // Call the `configure` callback.
        options = (await this.configure?.({ options })) ?? options;

        // Create the map instance.
        this.instance = new googleMaps.Map(this.mapElement, {
          backgroundColor: 'none',
          ...options,
        });

        // Get the street view panorama associated with the map instance.
        const streetView = this.instance.getStreetView();

        // Resolve the initial map type.
        this.type = streetView.getVisible()
          ? 'street'
          : this.instance.getMapTypeId();

        // Detect when the street view visibility is changed.
        googleMaps.event.addListener(streetView, 'visible_changed', () => {
          this.type = streetView.getVisible()
            ? 'street'
            : this.instance!.getMapTypeId();
        });

        // Detect when the map type is changed.
        googleMaps.event.addListener(this.instance, 'maptypeid_changed', () => {
          this.type = streetView.getVisible()
            ? 'street'
            : this.instance!.getMapTypeId();
        });

        // Wait for the map to become idle.
        googleMaps.event.addListenerOnce(this.instance, 'idle', async () => {
          // Indicate that the component is attached.
          this.state = 'attached';

          // Attach objects.
          for (const object of this._objects.slice()) {
            object.attach();
          }

          // Call the `configured` callback.
          await this.configured?.({ map: this.instance! });

          // Indicate that the component is ready.
          this.state = 'ready';
        });

        // const directionsService = new google.maps.DirectionsService();
        // const route = new Promise<any>(function (resolve, reject) {
        //   directionsService.route(
        //     {
        //       origin: { lat: 56.142, lng: 10.148 },
        //       destination: { lat: 56.164, lng: 10.149 },
        //       travelMode: google.maps.TravelMode.DRIVING,
        //     },
        //     (result: any, status: google.maps.DirectionsStatus) => {
        //       if (status === google.maps.DirectionsStatus.OK) {
        //         resolve(result);
        //       } else {
        //         reject(result);
        //       }
        //     }
        //   );
        // });
        // const directions = await route;
        // const directionsRenderer = new google.maps.DirectionsRenderer();
        // directionsRenderer.setMap(this.instance);
        // directionsRenderer.setDirections(directions);
      })

      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Called by the framework when the component is detached.
   */
  public detached(): void {
    // Detach objects.
    for (const object of this._objects.slice()) {
      object.detach();
    }

    // Indicate that the component is detached.
    this.state = 'detached';
  }

  /**
   * Registers the specified objects as owned by this object.
   */
  public register(...objects: IGoogleMapObject[]): void {
    for (const object of objects) {
      const index = this._objects.indexOf(object);

      if (index === -1) {
        this._objects.push(object);

        if (this.state === 'attached' || this.state === 'ready') {
          object.attach();
        }
      }
    }
  }

  /**
   * Unregisters the specified objects as owned by this object.
   */
  public unregister(...objects: IGoogleMapObject[]): void {
    for (const object of objects) {
      const index = this._objects.indexOf(object);

      if (index !== -1) {
        this._objects.splice(index, 1);

        if (this.state === 'attached' || this.state === 'ready') {
          object.detach();
        }
      }
    }
  }

  /**
   * Gets the specified CSS value, or if a variable name is specified, the value of the variable.
   * @param cssValueOrVariable The CSS value or variable name to get.
   * @returns The specified CSS value, of if a variable name is specified, the value of the variable.
   */
  public getCssValue(cssColorOrVariable: string): any {
    if (cssColorOrVariable.startsWith('--')) {
      if (this.mapElement[cssColorOrVariable] == null) {
        this.mapElement[cssColorOrVariable] = getComputedStyle(
          this.mapElement
        ).getPropertyValue(cssColorOrVariable);
      }

      return this.mapElement[cssColorOrVariable]?.trim();
    }

    return cssColorOrVariable.trim();
  }

  /**
   * Called when the user interacts with the map.
   * @returns True to continue processing the event.
   */
  protected onInteraction(): boolean {
    // Indicate that the user has interacted with the map.
    this.touched = true;

    return true;
  }
}
