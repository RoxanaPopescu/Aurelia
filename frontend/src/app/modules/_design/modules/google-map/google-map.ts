import { autoinject } from "aurelia-framework";
import { GoogleMapCustomElement, GoogleMapMarkerCustomElement, GoogleMapType } from "shared/google-maps";
import { GeoJsonArea, GeoJsonPoint, GeoJsonPolygon } from "shared/types";

@autoinject
export class GoogleMapPage
{
    public constructor()
    {
        function getMarkerCircle(center: [number, number], radius: number, markerCount: number): any
        {
            const markers: any[] = [];

            for (let i = 0; i < markerCount; i++)
            {
                const angle = Math.PI / 2 + Math.PI * 2 / markerCount * i;
                const offsetX = radius *  Math.cos(angle);
                const offsetY = radius *  Math.sin(angle);

                markers.push(
                {
                    point: new GeoJsonPoint([offsetX + center[0], offsetY / 3 + center[1]]),
                    title: `Marker ${i}`,
                    zIndex: i
                });
            }

            return markers;
        }

        this.markers = getMarkerCircle([12.579, 55.632], 30, 30);

        this.area = new GeoJsonPolygon(
        [
            getMarkerCircle([12.579, 55.632], 20, 30).map(m => m.point.coordinates),
            getMarkerCircle([12.579, 55.632], 10, 30).map(m => m.point.coordinates).reverse()
        ]);

        this.centerMarker =
        {
            point: new GeoJsonPoint([12.579, 55.632]),
            title: "Center marker",
            zIndex: 21
        };
    }

    protected centerMarker: any;
    protected markers: any[] = [];
    protected area: GeoJsonArea;
    protected markersAdded: GoogleMapMarkerCustomElement[] = [];

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
     * Called by the `google-map` component when the map is being configured.
     * @param options The map options to use.
     */
    public onMapConfigure(options: google.maps.MapOptions): void
    {
        options.gestureHandling = "greedy";
        options.controlSize = 40;
        options.fullscreenControl = false;
        options.minZoom = 2;
        options.mapTypeControlOptions =
        {
            position: google.maps.ControlPosition.TOP_RIGHT
        };
        options.zoomControlOptions =
        {
            position: google.maps.ControlPosition.TOP_RIGHT
        };
        options.streetViewControlOptions =
        {
            position: google.maps.ControlPosition.TOP_RIGHT
        };
        options.panControlOptions =
        {
            position: google.maps.ControlPosition.TOP_RIGHT
        };
        options.rotateControlOptions =
        {
            position: google.maps.ControlPosition.TOP_RIGHT
        };
        options.restriction =
        {
            latLngBounds: { north: 85, south: -85, west: -180, east: 180 }
        };
    }

    /**
     * Called by the `google-map` component when the map has been created.
     * @param map The map instance.
     */
    protected onMapConfigured(mapInstance: google.maps.Map): void
    {
        this.mapInstance = mapInstance;

        // this.centerCurrentPosition();
    }

    /**
     * Centers the map on the current position of the user.
     */
    protected centerCurrentPosition(): void
    {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(position =>
            {
                if (!this.mapTouched)
                {
                    const currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    this.mapInstance.setCenter(currentPosition);
                    this.mapInstance.setZoom(Math.max(this.mapInstance.getZoom(), 14));
                }
            },
            error => console.error(error));
        }
    }

    protected addMarkers(): void
    {
        for (const m of this.markers)
        {
            const marker = new GoogleMapMarkerCustomElement(this.mapViewModel);
            marker.point = new GeoJsonPoint([m.point.coordinates[0], m.point.coordinates[1]]);
            marker.title = m.title;
            marker.zIndex = m.zIndex;
            marker.attached();

            this.markersAdded.push(marker);
        }
    }

    protected removeMarkers(): void
    {
        for (const marker of this.markersAdded)
        {
            marker.detached();
        }

        this.markersAdded = [];
    }
}
