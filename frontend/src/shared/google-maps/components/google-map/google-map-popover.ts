import { autoinject, useShadowDOM, view, bindable } from "aurelia-framework";
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

    private _eventListeners: google.maps.MapsEventListener[] | undefined;
    private _infoWindow: google.maps.InfoWindow | undefined;
    private _visible = false;

    /**
     * The classes to apply to the info window element.
     */
    @bindable
    public classes: string | string[] | undefined;

    /**
     * Called when the component should attach to the owner.
     */
    public attach(): void
    {
        this._eventListeners =
        [
            google.maps.event.addListener(this._marker.marker!, "click", event =>
            {
                if (!event.domEvent.defaultPrevented)
                {
                    if (this._visible)
                    {
                        this._visible = false;
                        this._infoWindow?.close();
                    }
                    else
                    {
                        this.openInfoWindow(event.latLng, true);
                        this._visible = true;
                    }
                }
            }),

            google.maps.event.addListener(this._marker.marker!, "mouseover", event =>
            {
                if (!event.domEvent.defaultPrevented && !this._visible)
                {
                    this.openInfoWindow(event.latLng, false);
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

        for (const eventListener of this._eventListeners!)
        {
            eventListener.remove();
        }

        this._eventListeners = undefined;

        this._infoWindow?.close();
    }

    /**
     * Opens the info window at the specified position.
     * @param latLng The anchor position.
     * @param pinned True if the info window should be pinned, otherwise false.
     */
    protected openInfoWindow(latLng: google.maps.LatLng, pinned: boolean): void
    {
        // Create the info window, if not already created.
        if (this._infoWindow == null)
        {
            // Create the info window.
            // Note that if the parent node of this custom element is a shadow root, it is assumed the host of
            // that shadow root is a custom element, representing a custom popover component.

            if (this._element.parentNode instanceof ShadowRoot)
            {
                this._infoWindow = new google.maps.InfoWindow(
                {
                    content: this._element.parentNode.host
                });
            }
            else
            {
                this._infoWindow = new google.maps.InfoWindow(
                {
                    content: this._element
                });
            }

            // Listener for the `closeclick` event.

            this._eventListeners!.push(...
            [
                google.maps.event.addListener(this._marker.marker!, "mouseout", () =>
                {
                    if (!this._visible)
                    {
                        this._infoWindow!.close();
                    }
                }),

                google.maps.event.addListener(this._infoWindow, "closeclick", () =>
                {
                    this._visible = false;
                })
            ]);
        }

        // Position the info window at the coordinates associated with the event.
        this._infoWindow.setPosition(latLng);

        // Open the info window, if not already open.
        if (!this._visible)
        {
            // Open the info window.
            this._infoWindow.open(this._map.map, this._marker.marker);

            // Find the info window element.
            const contentElement = this._infoWindow.getContent() as HTMLElement;
            const infoWindowElement = contentElement.closest(".gm-style-iw");

            if (infoWindowElement != null)
            {
                if (pinned)
                {
                    // Apply the `--pinned` class to the info window element.
                    infoWindowElement.classList.add("--pinned");
                }

                // Apply any additional classes to the info window element.
                if (this.classes != null)
                {
                    infoWindowElement.classList.add(...this.classes);
                }
            }
        }
    }
}
