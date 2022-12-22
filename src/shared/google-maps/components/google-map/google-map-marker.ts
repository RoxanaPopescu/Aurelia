import {
  Container,
  autoinject,
  containerless,
  noView,
  bindable,
} from 'aurelia-framework';
import { CallbackWithContext, GeoJsonPoint } from 'shared/types';
import { GoogleMapCustomElement } from './google-map';
import { GoogleMapObject } from './google-map-object';
import { geoJsonPointToLatLng } from './google-map-utilities';

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
@containerless
@noView
export class GoogleMapMarkerCustomElement extends GoogleMapObject<google.maps.Marker> {
  /**
   * Creates a new instance of the type.
   * @param map The `GoogleMapCustomElement` instance owning the component.
   * @param container The `Container` instance associated with the component.
   */
  public constructor(map: GoogleMapCustomElement, container?: Container) {
    super(map);

    container?.registerInstance(GoogleMapObject, this);

    this._map = map;
  }

  private readonly _map: GoogleMapCustomElement;
  private _eventListeners: google.maps.MapsEventListener[] | undefined;

  /**
   * The point at which the marker is located.
   */
  @bindable
  public point: GeoJsonPoint;

  /**
   * The z-index of the marker.
   */
  @bindable
  public zIndex: number | undefined;

  /**
   * The icon to use for the marker.
   */
  @bindable
  public icon:
    | google.maps.ReadonlyIcon
    | google.maps.ReadonlySymbol
    | undefined;

  /**
   * The label of the marker.
   */
  @bindable
  public label: string | google.maps.MarkerLabel | undefined;

  /**
   * The title of the marker.
   */
  @bindable
  public title: string | undefined;

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
   * Called by the map when the component should attach to the map.
   */
  public attach(): void {
    const label = this.label
      ? {
          fontFamily: 'var(--font-base-font-family)',
          fontSize: '10rem',
          fontWeight: '500',
          color: '#fff',
          ...(typeof this.label === 'string'
            ? { text: this.label }
            : this.label),
        }
      : undefined;

    this.instance = new google.maps.Marker({
      map: this._map.instance,
      position: geoJsonPointToLatLng(this.point),
      label,
      title: this.title,
      zIndex: this.zIndex,
      clickable: true,
      icon: this.icon,
    });

    this._eventListeners = [];

    for (const eventName of eventNames) {
      this._eventListeners.push(
        this.instance.addListener(eventName as any, (event: any) => {
          const result = this[eventName]?.({ event: event.domEvent });

          if (result === false) {
            event.domEvent.preventDefault();
          }
        })
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

      for (const eventListener of this._eventListeners!) {
        eventListener.remove();
      }

      this._eventListeners = undefined;
    }
  }

  /**
   * Called by the framework when the `point` property changes.
   */
  protected pointChanged(): void {
    this.instance?.setPosition(geoJsonPointToLatLng(this.point));
  }

  /**
   * Called by the framework when the `zIndex` property changes.
   */
  protected zIndexChanged(): void {
    this.instance?.setZIndex(this.zIndex || null);
  }

  /**
   * Called by the framework when the `icon` property changes.
   */
  protected iconChanged(): void {
    this.instance?.setIcon(this.icon || null);
  }

  /**
   * Called by the framework when the `title` property changes.
   */
  protected titleChanged(): void {
    this.instance?.setTitle(this.title || null);
  }
}
