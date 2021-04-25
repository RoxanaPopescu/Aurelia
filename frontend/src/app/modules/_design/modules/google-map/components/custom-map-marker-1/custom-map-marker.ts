import { autoinject, containerless, bindable } from "aurelia-framework";

@autoinject
@containerless
export class CustomMapMarkerCustomElement
{
    public constructor()
    {
        setInterval(() => this.i++, 1000);
    }

    protected i = 0;

    /**
     * The model to use for the marker.
     */
    @bindable
    public model: any;
}
