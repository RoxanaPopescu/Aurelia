import { autoinject } from "aurelia-framework";
import { Modal, IValidation } from "shared/framework";
import { RouteTemplateStop } from "app/model/route-template";
import { RouteStopType } from "app/model/route";

@autoinject
export class StopDetailsPanelCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private _result: RouteTemplateStop | undefined;

    /**
     * True if the model represents a new stop, otherwise false.
     */
    protected isNew: boolean;

    /**
     * The model for the modal.
     */
    protected model: RouteTemplateStop;

    /**
     * The available types.
     */
    protected types = Object.keys(RouteStopType.values).map(slug => new RouteStopType(slug as any));

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model?: RouteTemplateStop): void
    {
        this.isNew = model == null;
        this.model = model != null ? model.clone() : new RouteTemplateStop();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited stop, or undefined if cancelled.
     */
    public async deactivate(): Promise<RouteTemplateStop | undefined>
    {
        if (!this.isNew)
        {
            this._result = this.model;
        }

        if (this._result != null)
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                this._result = undefined;

                // tslint:disable-next-line: no-string-throw
                throw "Cannot close while validation errors exist.";
            }
        }

        return this._result;
    }

    /**
     * Called when the "Create stop" button is clicked.
     */
    protected async onCreateClick(): Promise<void>
    {
        this._result = this.model;
        await this._modal.close();
    }
}
