import {
  Container,
  autoinject,
  view,
  useShadowDOM,
  bindable,
} from 'aurelia-framework';
import { CallbackWithContext, GeoJsonPoint } from 'shared/types';
import { EventManager } from 'shared/utilities';
import { GoogleMapCustomElement } from './google-map';
import { GoogleMapObject } from './google-map-object';
import {
  createHtmlOverlayView,
  geoJsonPointToLatLng,
  IHtmlOverlayView,
} from './google-map-utilities';

// The names of the instance events that should be re-dispatched by the component.
const eventNames = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'dragstart',
  'drag',
  'dragend',
  'contextmenu',
];

/**
 * Represents a marker on a map.
 */
@autoinject
@useShadowDOM
@view('<template><slot></slot></template>')
export class GoogleMapHtmlMarkerCustomElement extends GoogleMapObject<IHtmlOverlayView> {
  /**
   * Creates a new instance of the type.
   * @param map The `GoogleMapCustomElement` instance owning the component.
   * @param container The `Container` instance associated with the component.
   */
  public constructor(
    element: Element,
    map: GoogleMapCustomElement,
    container?: Container
  ) {
    super(map);

    container?.registerInstance(GoogleMapObject, this);

    this.content = element as HTMLElement;
    this._map = map;
  }

  private readonly _map: GoogleMapCustomElement;
  private readonly _eventManager = new EventManager(this);

  /**
   * The element representing the content to present.
   */
  @bindable
  public content: HTMLElement;

  /**
   * The element representing the class to present.
   */
  @bindable
  public warning: any;

  /**
   * The point at which the marker is located.
   */
  @bindable
  public point: GeoJsonPoint;

  /**
   * The z-index of the marker, or undefined to use the default.
   */
  @bindable
  public zIndex: number | undefined;

  /**
   * The function to call when a `click` event occurs.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public click: CallbackWithContext<
    { event: PointerEvent },
    boolean | undefined
  >;

  /**
   * The function to call when a `dblclick` event occurs.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public dblclick: CallbackWithContext<
    { event: MouseEvent },
    boolean | undefined
  >;

  /**
   * The function to call when a `mousedown` event occurs.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public mousedown: CallbackWithContext<
    { event: MouseEvent },
    boolean | undefined
  >;

  /**
   * The function to call when a `mouseup` event occurs.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public mouseup: CallbackWithContext<
    { event: MouseEvent },
    boolean | undefined
  >;

  /**
   * The function to call when a `mouseover` event occurs.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public mouseover: CallbackWithContext<
    { event: MouseEvent },
    boolean | undefined
  >;

  /**
   * The function to call when a `mouseout` event occurs.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public mouseout: CallbackWithContext<
    { event: MouseEvent },
    boolean | undefined
  >;

  /**
   * The function to call when a `dragstart` event occurs.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public dragstart: CallbackWithContext<
    { event: DragEvent },
    boolean | undefined
  >;

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
  public dragend: CallbackWithContext<
    { event: DragEvent },
    boolean | undefined
  >;

  /**
   * The function to call when a `contextmenu` event occurs.
   * @returns False to prevent default, otherwise true or undefined.
   */
  @bindable
  public contextmenu: CallbackWithContext<
    { event: PointerEvent },
    boolean | undefined
  >;

  /**
   * Called by the framework when the component is binding.
   */
  public bind(): void {
    // Prevent the element from appearing before its ready.
    this.content.style.display = 'none';
  }

  /**
   * Called by the map when the component should attach to the map.
   */
  public attach(): void {
    this.instance = createHtmlOverlayView({
      element: this.content,
      position: geoJsonPointToLatLng(this.point),
      zIndex: this.zIndex,
      map: this._map.instance!,

      // Allow the element to appear.
      ready: () => {
        this.content.style.backgroundColor = this.warning
          ? 'var(--palette-color-attention)'
          : '';
        this.content.style.width = this.warning ? '20rem' : '';
        this.content.style.height = this.warning ? '20rem' : '';
        this.content.style.display = '';
      },
    });

    for (const eventName of eventNames) {
      this._eventManager.addEventListener(
        this.content,
        eventName,
        (event: Event) => {
          const result = this[eventName]?.({ event });

          if (result === false) {
            event.preventDefault();
          }
        }
      );
    }

    super.attach();
  }

  /**
   * Called by the map when the component should detach from the map.
   */
  public detach(): void {
    super.detach();

    if (this.instance != null) {
      this.instance.setMap(null);
      this.instance = undefined;

      this._eventManager.removeEventListeners();
    }
  }

  /**
   * Called by the framework when the `point` property changes.
   */
  protected pointChanged(): void {
    if (this.instance != null) {
      this.instance.position = geoJsonPointToLatLng(this.point);
    }
  }

  /**
   * Called by the framework when the `zIndex` property changes.
   */
  protected zIndexChanged(): void {
    if (this.instance != null) {
      this.instance.zIndex = this.zIndex;
    }
  }
}
