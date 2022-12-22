import { autoinject, useShadowDOM, view, bindable, bindingMode } from "aurelia-framework";
import { EventManager, delay } from "shared/utilities";
import { GoogleMapCustomElement } from "./google-map";
import { GoogleMapObject } from "./google-map-object";
import { IHtmlOverlayView } from "./google-map-utilities";

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

        this.content = element as HTMLElement;
        this._map = map;
    }

    private readonly _map: GoogleMapCustomElement;
    private readonly _eventManager = new EventManager(this);
    private _ownerEventListeners: google.maps.MapsEventListener[] | undefined;
    private _instanceEventListeners: google.maps.MapsEventListener[] | undefined;
    private _infoWindowElement: HTMLElement | undefined;

    /**
     * The element representing the content to present.
     */
    @bindable
    public content: HTMLElement;

    /**
     * True if the popover is pinned open, otherwise false.
     */
     @bindable({ defaultBindingMode: bindingMode.twoWay, defaultValue: false })
    public pinned;

    /**
     * The horizontal offset, in pixels.
     */
     @bindable({ defaultValue: 0 })
    public offsetX: number;

    /**
     * The vertical offset, in pixels.
     */
     @bindable({ defaultValue: 0 })
    public offsetY: number;

    /**
     * The event that should cause the map to pan, to bring the popover into view, if any.
     */
     @bindable({ defaultValue: "pin" })
    public autoPan: "hover" | "pin" | undefined;

    /**
     * The classes to apply to the info window element, if any.
     */
    @bindable
    public classes: string | string[] | undefined;

    /**
     * True to close other popovers when this oppover opens, otherwise false.
     */
     @bindable({ defaultValue: true })
    public singleton: boolean;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        // Prevent the element from appearing before its ready.
        this.content.style.display = "none";
    }

    /**
     * Called when the component should attach to the owner.
     */
    public attach(): void
    {
        // Add event listeners for the owner of this popup.

        if (this.owner.instance instanceof google.maps.OverlayView)
        {
            const instance = this.owner.instance as IHtmlOverlayView;

            this._eventManager.addEventListener(instance.element, "click", (event: MouseEvent) =>
            {
                if (!event.defaultPrevented)
                {
                    if (this.pinned)
                    {
                        this.closeInfoWindow();
                    }
                    else
                    {
                        if (this.autoPan === "pin")
                        {
                            this.closeInfoWindow();
                        }

                        this.openInfoWindow(instance.position, this.autoPan !== undefined);
                        this.pinned = true;
                    }
                }
            });

            this._eventManager.addEventListener(instance.element, "mouseover", (event: MouseEvent) =>
            {
                if (!event.defaultPrevented && !this.pinned)
                {
                    this.openInfoWindow(instance.position, this.autoPan === "hover");
                }
            });

            this._eventManager.addEventListener(instance.element, "mouseout", (event: MouseEvent) =>
            {
                if (!event.defaultPrevented && !this.pinned)
                {
                    this.closeInfoWindow();
                }
            });
        }
        else
        {
            this._ownerEventListeners =
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
                            if (this.autoPan === "pin")
                            {
                                this.closeInfoWindow();
                                this.pinned = true;
                                this.openInfoWindow(event.latLng, this.autoPan !== undefined);
                            }
                            else
                            {
                                this.pinned = true;
                            }
                        }
                    }
                }),

                google.maps.event.addListener(this.owner.instance!, "mouseover", event =>
                {
                    if (!event.domEvent.defaultPrevented && !this.pinned)
                    {
                        this.openInfoWindow(event.latLng, this.autoPan === "hover");
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
        }

        if (this.pinned)
        {
            this.openInfoWindow(undefined, this.autoPan === "pin");
        }

        super.attach();
    }

    /**
     * Called when the component should detach from the owner.
     */
    public detach(): void
    {
        super.detach();

        if (this.instance != null)
        {
            this.closeInfoWindow();

            this._eventManager.removeEventListeners();

            if (this._ownerEventListeners != null)
            {
                for (const eventListener of this._ownerEventListeners)
                {
                    eventListener.remove();
                }

                this._ownerEventListeners = undefined;
            }
        }
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
                    this.openInfoWindow(undefined, this.autoPan === "pin");
                }
                else
                {
                    this.updateInfoWindowClasses();
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
     * @param position The position at which the info window should be anchored.
     * @param autoPan True to pan the map to bring the popup into view, otherwise false.
     */
    private openInfoWindow(position: google.maps.LatLng | undefined, autoPan: boolean): void
    {
        if (this.instance == null)
        {
            this.instance = new google.maps.InfoWindow(
            {
                disableAutoPan: !autoPan,
                content: this.content,
                pixelOffset: new google.maps.Size(this.offsetX, this.offsetY)
            });

            // Add event listeners for this popover.

            this._instanceEventListeners =
            [
                google.maps.event.addListener(this.instance, "closeclick", () =>
                {
                    this.closeInfoWindow();
                })
            ];

            // Allow the element to appear.
            this.content.style.display = "";
        }

        // Position the info window at the specified position.

        if (position != null)
        {
            this.instance.setPosition(position);
        }

        // HACK: Add this popover instance to the collection stored on the map, and optionally close other popovers.

        const openPopovers: Set<GoogleMapPopoverCustomElement> = (this._map as any).__openPopovers ??= new Set<GoogleMapPopoverCustomElement>();

        openPopovers.add(this);

        if (this.singleton)
        {
            for (const popover of openPopovers)
            {
                if (popover !== this)
                {
                    popover.closeInfoWindow();
                }
            }
        }

        // Open the info window.
        this.instance.open(this._map.instance, this.owner.instance);

        // Find the info window element.
        // tslint:disable-next-line: no-floating-promises
        this.applyInfoWindowClasses();
    }

    /**
     * Closes the info window.
     */
    private closeInfoWindow(): void
    {
        if (this.instance != null)
        {
            // Destroy the info window.

            this.instance.close();
            this.instance = undefined;
            this.pinned = false;
            this._infoWindowElement = undefined;

            // Remove event listeners for this popover.

            for (const eventListener of this._instanceEventListeners!)
            {
                eventListener.remove();
            }

            this._instanceEventListeners = undefined;

            // HACK: Remove this popover instance from the collection stored on the map.

            const openPopovers: Set<GoogleMapPopoverCustomElement> = (this._map as any).__openPopovers ??= new Set<GoogleMapPopoverCustomElement>();

            openPopovers.delete(this);
        }
    }

    /**
     * Find the info window element and apply classes.
     */
    private async applyInfoWindowClasses(): Promise<void>
    {
        const contentElement = this.instance!.getContent() as HTMLElement;
        let remainingAttempts = 10;

        this._infoWindowElement = undefined;

        while (this.instance != null && this._infoWindowElement == null && remainingAttempts-- > 0)
        {
            this._infoWindowElement = contentElement.closest(".gm-style-iw-a") as HTMLElement ?? undefined;

            if (this._infoWindowElement != null)
            {
                // Apply any additional classes to the info window element.
                if (this.classes != null)
                {
                    this._infoWindowElement.classList.add(...this.classes);
                }

                this.updateInfoWindowClasses();

                return;
            }

            await delay(200 / remainingAttempts);
        }
    }

    /**
     * Updates the classes applied to the info window element.
     */
    private updateInfoWindowClasses(): void
    {
        // When pinned, apply the `--pinned` class to the info window element.
        this._infoWindowElement?.classList.toggle("--pinned", this.pinned);
    }
}
