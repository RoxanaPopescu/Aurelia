import { autoinject, useShadowDOM, view, bindable, bindingMode } from "aurelia-framework";
import { delay } from "shared/utilities";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";

/**
 * Represents a popover associated with a owner on a map.
 */
@autoinject
@useShadowDOM
@view("<template><slot></slot></template>")
export class GoogleMapPopoverCustomElement extends GoogleMapObject<google.maps.InfoWindow>
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param map The `GoogleMapCustomElement` instance owning the component.
     * @param owner The `GoogleMapObject` instance owning this instance.
     */
    public constructor(element: Element, map: GoogleMapCustomElement, owner: GoogleMapObject)
    {
        super(owner);

        this._element = element as HTMLElement;
        this._map = map;
    }

    private readonly _element: HTMLElement;
    private readonly _map: GoogleMapCustomElement;
    private _eventListeners: google.maps.MapsEventListener[] | undefined;

    /**
     * True if the popover is pinned open, otherwise false.
     */
     @bindable({ defaultBindingMode: bindingMode.twoWay, defaultValue: false })
    private pinned;

    /**
     * True to pan the map to bring the popup into view, otherwise false.
     */
     @bindable({ defaultValue: true })
    private autoPan;

    /**
     * The classes to apply to the info window element, if any.
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
            google.maps.event.addListener(this.owner.instance!, "click", event =>
            {
                if (!event.domEvent.defaultPrevented)
                {
                    if (this.pinned)
                    {
                        this.closeInfoWindow();
                    }
                    else
                    {
                        this.openInfoWindow(event.latLng, true);
                        this.pinned = true;
                    }
                }
            }),

            google.maps.event.addListener(this.owner.instance!, "mouseover", event =>
            {
                if (!event.domEvent.defaultPrevented && !this.pinned)
                {
                    this.openInfoWindow(event.latLng, false);
                }
            }),

            google.maps.event.addListener(this.owner.instance!, "mouseout", event =>
            {
                if (!event.domEvent.defaultPrevented && !this.pinned)
                {
                    this.closeInfoWindow();
                }
            })
        ];

        if (this.pinned)
        {
            this.openInfoWindow(undefined, true);
        }

        super.attach();
    }

    /**
     * Called when the component should detach from the owner.
     */
    public detach(): void
    {
        super.detach();

        this.closeInfoWindow();

        for (const eventListener of this._eventListeners!)
        {
            eventListener.remove();
        }

        this._eventListeners = undefined;
    }

    /**
     * Called by the framework when the `pinned` property changes.
     */
    protected pinnedChanged(): void
    {
        if (this.isAttached)
        {
            if (this.pinned)
            {
                if (this.instance == null)
                {
                    this.openInfoWindow(undefined, true);
                }
            }
            else
            {
                if (this.instance != null)
                {
                    this.closeInfoWindow();
                }
            }
        }
    }

    /**
     * Opens the info window at the specified position.
     * @param latLng The position at which the info window should be anchored.
     * @param pinned True if the info window should be pinned open, otherwise false.
     */
    private openInfoWindow(latLng?: google.maps.LatLng, pinned = false): void
    {
        if (this.instance == null)
        {
            // Create the info window.
            // Note that if the parent node of this custom element is a shadow root, it is assumed the host of
            // that shadow root is a custom element, representing a custom popover component.

            if (this._element.parentNode instanceof ShadowRoot)
            {
                this.instance = new google.maps.InfoWindow(
                {
                    disableAutoPan: !this.autoPan,
                    content: this._element.parentNode.host
                });
            }
            else
            {
                this.instance = new google.maps.InfoWindow(
                {
                    disableAutoPan: !this.autoPan,
                    content: this._element
                });
            }

            // Listener for the `closeclick` event.

            this._eventListeners!.push(...
            [
                google.maps.event.addListener(this.instance, "closeclick", () =>
                {
                    this.pinned = false;
                    this.instance = undefined;
                })
            ]);
        }

        // Position the info window at the specified position.

        if (latLng != null)
        {
            this.instance.setPosition(latLng);
        }

        // Open the info window.
        this.instance.open(this._map.instance, this.owner.instance);

        // Find the info window element.
        // tslint:disable-next-line: no-floating-promises
        this.applyInfoWindowClasses(pinned);
    }

    /**
     * Closes the info window.
     */
    private closeInfoWindow(): void
    {
        if (this.instance != null)
        {
            this.instance.close();
            this.instance = undefined;
            this.pinned = false;
        }
    }

    /**
     * Find the info window element and apply classes.
     * @param pinned True if the info window should be pinned open, otherwise false.
     */
    private async applyInfoWindowClasses(pinned: boolean): Promise<void>
    {
        const contentElement = this.instance!.getContent() as HTMLElement;
        let infoWindowElement: HTMLElement | null;
        let remainingAttempts = 10;

        do
        {
            infoWindowElement = contentElement.closest(".gm-style-iw");

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

                return;
            }

            await delay(200 / remainingAttempts);
        }
        while (this.instance != null && infoWindowElement == null && --remainingAttempts > 0);
    }
}
