import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { RoleService, RoleInfo } from "app/model/role";

/**
 * Represents the page.
 */
@autoinject
export class RolesPage
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
    protected updateOperation: Operation;

    /**
     * The items to present in the table.
     */
    protected roles: RoleInfo[] | undefined;

    /**
     * True if a new role is being added, otherwise false.
     */
    protected create = false;

    /**
     * Called by the framework when the module is activated.
     */
    public activate(): void
    {
        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            // Fetch the data.
            this.roles = await this._roleService.getAll(signal);
        });

        this.create = false;
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }
    }
}
