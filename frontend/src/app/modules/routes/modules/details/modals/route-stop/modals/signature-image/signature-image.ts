import { autoinject, bindable } from 'aurelia-framework';
import { RouteStop, /*RouteService*/ } from "app/model/route";

@autoinject
export class SignatureImage
{
    /**
     * Creates a new instance of the class.
     * @param model The RouteStop to display signature image.
     */
    public constructor(model: RouteStop)
    {
        this.model = this._model;
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: RouteStop): void
    {
        this.model = model;
    }

    private readonly _model: RouteStop
    /**
     * The model for the modal.
     */
    @bindable
    public model: RouteStop;
}