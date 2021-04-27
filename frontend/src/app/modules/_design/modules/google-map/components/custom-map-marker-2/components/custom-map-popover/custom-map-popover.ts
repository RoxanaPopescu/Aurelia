import { autoinject, useShadowDOM, bindable } from "aurelia-framework";

@autoinject
@useShadowDOM
export class CustomMapPopoverCustomElement
{
    public constructor()
    {
        setInterval(() => this.i++, 1000);
    }

    protected i = 0;

    /**
     * The model to use for the popover.
     */
    @bindable
    public model: any;
}
