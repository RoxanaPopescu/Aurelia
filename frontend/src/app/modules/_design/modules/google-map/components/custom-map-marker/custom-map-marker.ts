import { autoinject, containerless, bindable } from "aurelia-framework";

@autoinject
@containerless
export class CustomMapMarkerCustomElement
{
    protected icon =
    {
        // tslint:disable-next-line: no-require-imports
        url: require("./resources/images/marker.svg")
    };

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
