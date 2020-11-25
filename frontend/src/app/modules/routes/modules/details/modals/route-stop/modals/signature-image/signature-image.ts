import { autoinject, bindable } from "aurelia-framework";
import { RouteStop } from "app/model/route";

@autoinject
export class SignatureImage
{
    /**
     * The model for the modal.
     */
    @bindable
    public model: RouteStop;

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: RouteStop): void
    {
        this.model = model;
    }
}
