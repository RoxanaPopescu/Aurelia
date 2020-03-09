/**
 * Represents a coordinate identifying a geographic position.
 */
export class Position
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.latitude = data.latitude;
        this.longitude = data.longitude;
    }

    /**
     * The latitude of the position.
     */
    public latitude: number;

    /**
     * The longitude of the position.
     */
    public longitude: number;

    /**
     * Creates a new `LatLng` object, representing this position in Google Maps.
     */
    public toGoogleLatLng(): google.maps.LatLng
    {
        return new google.maps.LatLng(this.latitude, this.longitude);
    }

    /**
     * Creates a new `LatLngLiteral` object, representing this position in Google Maps.
     */
    public toGoogleLatLngLiteral(): google.maps.LatLngLiteral
    {
        return { lat: this.latitude, lng: this.longitude };
    }
}
