import { Position } from 'app/model/shared';
import {
  autoinject,
  useShadowDOM,
  bindable,
  computedFrom,
} from 'aurelia-framework';
import { Callback, GeoJsonPoint } from 'shared/types';

/**
 * Represents a map feature that presents a position on the path driven by the driver.
 */
@autoinject
@useShadowDOM
export class RouteDriverPathPositionMapFeatureCustomElement {
  /**
   * The element representing the component, and the content to be presented.
   */
  protected element: HTMLElement;

  /**
   * The position to present.
   */
  @bindable
  public position: any;

  /**
   * The driver to present.
   */
  @bindable
  public driver: any;

  /**
   * isStartMarker boolean.
   */
  @bindable
  public isstartmarker: any;

  /**
   * isEndMarker boolean.
   */
  @bindable
  public isendmarker: any;

  /**
   * The function to call when the route stop is clicked, if any.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public onClick: Callback<boolean | undefined> | undefined;

  /**
   * The function to call when the route stop is double-clicked, if any.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public onDblClick: Callback<boolean | undefined> | undefined;

  /**
   * Gets the point representing the route stop, if available.
   */
  @computedFrom('position')
  protected get point(): GeoJsonPoint {
    const position = new Position(this.position);
    return position.toGeoJsonPoint();
  }
}
