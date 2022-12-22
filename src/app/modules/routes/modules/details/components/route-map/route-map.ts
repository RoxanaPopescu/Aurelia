import { autoinject, bindable } from 'aurelia-framework';
import { GoogleMapCustomElement, GoogleMapType } from 'shared/google-maps';

@autoinject
export class RouteMap {
  protected _hasFittedBounds = false;

  /**
   * The map view model.
   */
  protected mapViewModel: GoogleMapCustomElement;

  /**
   * The map instance.
   */
  protected mapInstance: google.maps.Map;

  /**
   * The type of map being presented, or undefined if the map is not ready yet.
   */
  protected mapType: GoogleMapType | undefined;

  /**
   * The data to present.
   */
  @bindable
  public data: any;

  /**
   * Attempts to fit the map bounds based on the data being presented.
   */
  protected tryFitBounds(): void {
    // TODO: Fit bounds with mapInstance
  }
}
