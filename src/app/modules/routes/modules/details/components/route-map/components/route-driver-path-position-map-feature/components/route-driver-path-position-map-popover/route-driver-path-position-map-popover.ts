import { autoinject, useShadowDOM, bindable } from 'aurelia-framework';
import { Position } from 'app/model/shared';

@autoinject
@useShadowDOM
export class RouteDriverPathPositionMapPopoverCustomElement {
  /**
   * The element representing the component, and the content to be presented.
   */
  protected element: HTMLElement;

  /**
   * The driver to present.
   */
  @bindable
  public driver: any;

  /**
   * The position to present.
   */
  @bindable
  public position: Position;
}
