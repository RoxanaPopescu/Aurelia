import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { OrganizationService, OrganizationTeam } from "app/model/organization";

@autoinject
export class EditTeamPanel
{
    /**
     * Creates a new instance of the type.
     * @param organizationService The `OrganizationService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(organizationService: OrganizationService, modal: Modal)
    {
        this._organizationService = organizationService;
        this._modal = modal;
    }

    private readonly _organizationService: OrganizationService;
    private readonly _modal: Modal;
    private _result: OrganizationTeam | undefined;

    /**
     * The name of the team, before editing.
     */
    protected teamName: string | undefined;

    /**
     * The team for the modal.
     */
    protected team: OrganizationTeam;

    /**
     * The teams within the organization, used to verify uniqueness of the team name.
     */
    protected teams: OrganizationTeam[];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { team?: OrganizationTeam, teams?: OrganizationTeam[] }): void
    {
        this.team = model.team?.clone() ?? new OrganizationTeam();
        this.teamName = this.team.name;
        this.teams = model.teams ?? [] as any;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The new or edited team, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrganizationTeam | undefined>
    {
        return this._result;
    }

    /**
     * Called when the `Create team` or `Save changes` button is clicked.
     */
    protected async onSubmitClick(): Promise<void>
    {
        try
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            this._modal.busy = true;

            if (this.team.id)
            {
                this._result = await this._organizationService.saveTeam(this.team);
            }
            else
            {
                this._result = await this._organizationService.createTeam(this.team);
            }

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("An error occurred while saving the team.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
