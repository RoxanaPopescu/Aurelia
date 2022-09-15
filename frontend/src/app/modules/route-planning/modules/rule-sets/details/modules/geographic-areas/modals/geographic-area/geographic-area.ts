import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { SpecialArea } from "app/model/_route-planning-settings";

@autoinject
export class GeographicAreaPanel
{
    /**
     * Creates a new instance of the class.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private _result: "draw-new-area" | "done" | undefined;

    /**
     * True if the model represents a new entity, otherwise false.
     */
    protected isNew: boolean;

    /**
     * The initial name of the area, used for validating the uniqueness of the name
     */
    protected areaName: string;

    /**
     * The existing areas, used for validating the uniqueness of the name.
     */
    protected allAreas: SpecialArea[];

    /**
     * The model for the modal.
     */
    protected model: SpecialArea;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model for the modal, or undefined if creating a new entity.
     */
    public activate(model: { area: SpecialArea; index?: number; allAreas: SpecialArea[] }): void
    {
        this.isNew = model.index == null;
        this.model = model.area;
        this.areaName = model.area.name;
        this.allAreas = model.allAreas;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The model for the modal, or undefined if cancelled.
     */
    public async deactivate(): Promise<"draw-new-area" | "done" | undefined>
    {
        return this._result;
    }

    /**
     * Called when the "Save and close" button is clicked.
     * Closes the modal and returns the model.
     */
    protected async onSaveAndCloseClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        this._result = "done";

        await this._modal.close();
    }

    /**
     * Called when the "Draw new area" button is clicked.
     * Closes the modal while the user draws the new area.
     */
    protected async onDrawNewAreaClick(): Promise<void>
    {
        this._result = "draw-new-area";

        await this._modal.close();
    }
}
