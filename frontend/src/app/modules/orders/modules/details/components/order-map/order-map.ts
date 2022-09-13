import { Order } from "app/model/order";
import { autoinject, bindable } from "aurelia-framework";
import { GoogleMapCustomElement, GoogleMapType } from "shared/google-maps";

@autoinject
export class OrderMap
{
    private _hasFittedBounds = false;

    /**
     * The map view model.
     */
    protected mapViewModel: GoogleMapCustomElement;

    /**
     * The map instance.
     */
    protected mapInstance: google.maps.Map;

    /**
     * True if the user has interacted with the map, otherwise false.
     */
    protected mapTouched: boolean;

    /**
     * The type of map being presented, or undefined if the map is not ready yet.
     */
    protected mapType: GoogleMapType | undefined;

    /**
     * The order to present.
     */
    @bindable
    public order: Order;

    /**
     * Called by the framework when the component is detached from the DOM.
     */
    public detached(): void
    {
        this._hasFittedBounds = false;
        this.mapViewModel = undefined as any;
        this.mapInstance = undefined as any;
        this.mapTouched = undefined as any;
        this.mapType = undefined as any;
    }

    /**
     * Called by the `google-map` component when the map is being configured.
     * @param options The map options to use.
     */
    protected onMapConfigure(options: google.maps.MapOptions): void
    {
        return;
    }

    /**
     * Called by the `google-map` component when the map has been created.
     * @param map The map instance.
     */
    protected onMapConfigured(mapInstance: google.maps.Map): void
    {
        this.mapInstance = mapInstance;

        if (!this._hasFittedBounds && !this.mapTouched)
        {
            this.tryFitBounds();
        }
    }

    /**
     * Called by the framework when the `order` property changes.
     */
    protected orderChanged(): void
    {
        if (!this._hasFittedBounds && !this.mapTouched)
        {
            setTimeout(() => this.tryFitBounds(), 150);
        }
    }

    /**
     * Attempts to fit the map bounds based on the data being presented.
     */
    protected tryFitBounds(): void
    {
        if (this.mapInstance == null || this.order == null)
        {
            return;
        }

        const orderBounds = new google.maps.LatLngBounds();

        if (this.order)
        {
            if (this.order.pickup.location.position != null)
            {
                orderBounds.extend(this.order.pickup.location.position.toGoogleLatLng());
            }

            if (this.order.delivery.location.position != null)
            {
                orderBounds.extend(this.order.delivery.location.position.toGoogleLatLng());
            }
        }

        if (!orderBounds.isEmpty())
        {
            this.mapInstance.fitBounds(orderBounds, { bottom: 60, left: 100, right: 200, top: 80 });
        }

        this._hasFittedBounds = true;
    }
}
