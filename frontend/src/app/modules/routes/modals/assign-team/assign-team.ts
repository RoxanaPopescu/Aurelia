import { autoinject, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal } from "shared/framework";
import { RouteAssignmentService, RouteBase } from "app/model/route";
import { OrganizationService, OrganizationTeam } from "app/model/organization";

@autoinject
export class AssignTeamPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param identityService The `IdentityService` instance.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param organizationService The `OrganizationService` instance.
     */
    public constructor(modal: Modal, routeAssignmentService: RouteAssignmentService, organizationService: OrganizationService)
    {
        this._modal = modal;
        this._routeAssignmentService = routeAssignmentService;
        this._organizationService = organizationService;
    }

    private readonly _modal: Modal;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _organizationService: OrganizationService;
    private _result: OrganizationTeam | "no-team" | undefined;

    /**
     * The searchg query, or undefined if ne search query is entered.
     */
    protected queryText: string | undefined;

    /**
     * The route to which a driver should be assigned
     */
    protected route: RouteBase;

    /**
     * If the team should be assigned within this modal
     */
    protected assignOnSelect: boolean;

    /**
     * The available teams.
     */
    protected teams: OrganizationTeam[] | undefined;

    /**
     * The available teams, filtered to include only those matching the query text.
     */
    @computedFrom("teams", "queryText")
    protected get filteredTeams(): OrganizationTeam[] | undefined
    {
        if (this.teams == null)
        {
            return undefined;
        }

        if (!this.queryText)
        {
            return this.teams;
        }

        const textFilter = this.queryText.toLowerCase();

        return this.teams
            .filter(connection => !textFilter || connection.searchModel.contains(textFilter));
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: { route: RouteBase; assignOnSelect: boolean }): void
    {
        this.route = model.route;
        this.assignOnSelect = model.assignOnSelect;

        // tslint:disable-next-line: no-unused-expression
        new Operation(async () =>
        {
            this.teams = await this._organizationService.getAccessibleTeams();
        });
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected fulfiller, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrganizationTeam | "no-team" | undefined>
    {
        return this._result;
    }

    /**
     * Called when a team in the list of teams is clicked.
     * Assigns the team to the route and closes the modal.
     */
    protected async onTeamClick(team?: OrganizationTeam): Promise<void>
    {
        try
        {
            if (this.assignOnSelect)
            {
                this._modal.busy = true;
                await this._routeAssignmentService.assignTeam(this.route, team);
            }

            if (team == null)
            {
                this._result = "no-team";
            }
            else
            {
                this._result = team;
            }

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not assign fulfiller", error);
            this._modal.busy = false;
        }
    }
}
