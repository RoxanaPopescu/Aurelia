import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class ImageDialog
{
    /**
     * The model for the modal.
     */
    @bindable
    public model: { imageUrl: string };

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { imageUrl: string }): void
    {
        this.model = model;
    }
}
