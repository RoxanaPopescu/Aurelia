import { autoinject, computedFrom } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { AutoContractorAssignmentRule } from "app/model/auto-contractor-assignment";
import { OrganizationInfo, OrganizationService } from "app/model/organization";

@autoinject
export class GeographicAreaPanel
{
    /**
     * Creates a new instance of the class.
     */
    public constructor(modal: Modal, organizationService: OrganizationService)
    {
        this._modal = modal;
        this._organizationService = organizationService;
    }

    private readonly _modal: Modal;
    private readonly _organizationService: OrganizationService;
    private _result: "draw-new-area" | "done" | undefined;

    /**
     * True if the model represents a new entity, otherwise false.
     */
    protected isNew: boolean;

    /**
     * The initial label of the area, used for validating the uniqueness of the label
     */
    protected areaLabel: string;

    /**
     * The existing areas, used for validating the uniqueness of the label.
     */
    protected allAreas: AutoContractorAssignmentRule[];

    /**
     * The model for the modal.
     */
    protected model: AutoContractorAssignmentRule;

    /**
     * The available organizations.
     */
    protected availableOrganizations: OrganizationInfo[];

    /**
     * The selected organization.
     */
    @computedFrom("availableOrganizations", "model.fulfillerId")
    protected get selectedOrganization(): OrganizationInfo | undefined
    {
        return this.availableOrganizations.find(o => o.id === this.model.fulfillerId);
    }

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model for the modal, or undefined if creating a new entity.
     */
    public async activate(model: { area: AutoContractorAssignmentRule; index?: number; allAreas: AutoContractorAssignmentRule[] }): Promise<void>
    {
        this.isNew = model.index == null;
        this.model = model.area;
        this.areaLabel = model.area.label;
        this.allAreas = model.allAreas;

        this.availableOrganizations = await (await this._organizationService.getConnections()).map(c => c.organization);
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
     * Called when the "Done" button is clicked.
     * Closes the modal and returns the model.
     */
    protected async onDoneClick(): Promise<void>
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
