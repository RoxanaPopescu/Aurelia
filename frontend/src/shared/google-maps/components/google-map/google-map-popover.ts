import { autoinject, useShadowDOM, view } from "aurelia-framework";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";
import { GoogleMapMarkerCustomElement } from "./google-map-marker";

/**
 * Represents a popover associated with a marker on a map.
 */
@autoinject
@useShadowDOM
@view("<template><slot></slot></template>")
export class GoogleMapPopoverCustomElement extends GoogleMapObject
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param map The `GoogleMapCustomElement` instance owning the component.
     * @param marker The `GoogleMapMarkerCustomElement` instance owning the component.
     */
    public constructor(element: Element, map: GoogleMapCustomElement, marker: GoogleMapMarkerCustomElement)
    {
        super(marker);

        this._element = element as HTMLElement;
        this._map = map;
        this._marker = marker;
    }

    private readonly _element: HTMLElement;
    private readonly _map: GoogleMapCustomElement;
    private readonly _marker: GoogleMapMarkerCustomElement;

    private _eventListeners: google.maps.MapsEventListener[];
    private _infoWindow: google.maps.InfoWindow | undefined;
    private _visible = false;

    /**
     * Called when the component should attach to the owner.
     */
    public attach(): void
    {
        const map = this._map.map!;
        const marker = this._marker.marker!;

        this._infoWindow = new google.maps.InfoWindow(
        {
            content: this._element
        });

        this._eventListeners =
        [
            google.maps.event.addListener(this._infoWindow, "closeclick", () =>
            {
                this._visible = false;
            }),

            google.maps.event.addListener(marker, "click", () =>
            {
                if (this._visible)
                {
                    this._visible = false;
                    this._infoWindow?.close();
                }
                else
                {
                    this._visible = true;
                    this._infoWindow?.open(map, marker);
                }
            }),

            google.maps.event.addListener(marker, "mouseover", () =>
            {
                if (!this._visible)
                {
                    this._infoWindow?.open(map, marker);
                }
            }),

            google.maps.event.addListener(marker, "mouseout", () =>
            {
                if (!this._visible)
                {
                    this._infoWindow?.close();
                }
            })
        ];

        super.attach();
    }

    /**
     * Called when the component should detach from the owner.
     */
    public detach(): void
    {
        super.detach();

        for (const eventListener of this._eventListeners)
        {
            eventListener.remove();
        }

        this._infoWindow?.close();
    }
}
