import { containerless, bindable, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { IValidation } from "shared/framework";
import { Role, RoleService, ClaimGroup } from "app/model/role";

@containerless
export class RoleItemCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param roleService The `RoleService` instance.
     */
    public constructor(roleService: RoleService)
    {
        this._roleService = roleService;
    }

    private readonly _roleService: RoleService;

    /**
     * The most recent update operation.
     */
    protected operation: Operation;

    /**
     * The validationb for the item.
     */
    protected validation: IValidation;

    /**
     * The role represented by the item.
     */
    protected role: Role | undefined;

    /**
     * True if the item is expanded, otherwise false.
     */
    protected expanded = false;

    /**
     * True if the item is in edit mode, otherwise false.
     */
    protected edit = false;

    /**
     * The role represented by the item, cloned to allow editing.
     */
    protected editModel: Role | undefined;

    /**
     * The available claim groups.
     */
    protected availableClaimGroups: ClaimGroup[] | undefined;

    /**
     * The info about the role represented by the item, or undefined if this is a new item.
     */
    @bindable
    public roleInfo: Role | undefined;

    /**
     * Called when the item is created.
     */
    @bindable
    public onCreated: () => void;

    /**
     * Called when editing is cancelled.
     */
    @bindable
    public onCanceled: () => void;

    /**
     * The claim groups that are not already selected.
     */
    @computedFrom("availableClaimGroups.length", "editModel.claimGroups.length")
    protected get filteredAvailableClaimGroups(): ClaimGroup[] | undefined
    {
        if (this.availableClaimGroups == null)
        {
            return undefined;
        }

        if (this.editModel == null || this.editModel.claimGroups == null)
        {
            return this.availableClaimGroups;
        }

        return this.availableClaimGroups.filter(g => !this.editModel!.claimGroups.some(g2 => g2.id === g.id));
    }

    /**
     * Called by the framework when the component is attached.
     */
    protected attached(): void
    {
        if (this.roleInfo == null)
        {
            this.onEditClick().catch(error => console.error(error));
        }
    }
    /**
     * Called when the item is clicked.
     * Toggle the item between its expanded and collapsed state.
     */
    protected async onItemClick(): Promise<void>
    {
        if (!this.expanded)
        {
            this.expanded = true;
            await this.fetchOrMakeRole();
        }
        else
        {
            this.expanded = false;
            this.role = undefined;
            this.editModel = undefined;
        }
    }

    /**
     * Called when the `Edit` button is clicked.
     * Transitions to the edit state.
     */
    protected async onEditClick(): Promise<void>
    {
        if (!this.expanded)
        {
            await this.fetchOrMakeRole();
            this.expanded = true;
        }

        this.edit = true;
    }

    /**
     * Called when the `Cancel` button is clicked.
     * Discards changes and transitions to the readonly state.
     */
    protected onCancelClick(): void
    {
        this.edit = false;
        this.editModel = this.role!.clone();

        if (this.onCanceled != null)
        {
            this.onCanceled();
        }
    }

    /**
     * Called when the `Save` button is clicked.
     * Saves changes and transitions to the readonly state.
     */
    protected async onSaveClick(): Promise<void>
    {
        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            if (this.roleInfo != null)
            {
                await this._roleService.update(this.editModel!);

                this.roleInfo.name = this.editModel!.name;
            }
            else
            {
                await this._roleService.create(this.editModel!);

                this.onCreated();
            }

            this.expanded = false;
            this.edit = false;
            this.role = undefined;
            this.editModel = undefined;
        }
        catch (error)
        {
            // TODO: Show proper error message.
            alert(`Failed to create role: ${error}`);
        }
    }

    /**
     * Fetches the data for the item.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    private async fetchOrMakeRole(): Promise<void>
    {
        if (this.roleInfo != null)
        {
            this.role = await this._roleService.get(this.roleInfo.id);
        }
        else
        {
            this.role = new Role();
        }

        this.editModel = this.role.clone();

        this.availableClaimGroups = await this._roleService.getClaimGroups();
    }
}
