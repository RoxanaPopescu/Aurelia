import { autoinject, containerless, bindable } from "aurelia-framework";

@autoinject
@containerless
export class CustomMapMarkerCustomElement
{
    /**
     * The model to use for the marker.
     */
    @bindable
    public model: any;

    protected onMarkerClick(event: MouseEvent): void
    {
        console.log("Marker clicked:", event);
    }
}
