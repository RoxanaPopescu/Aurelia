import { autoinject, computedFrom } from "aurelia-framework";
import { OrganizationService, OrganizationTeam } from "app/model/organization";

/**
 * Represents a service for managing the global teams filter.
 */
@autoinject
export class TeamsFilterService
{
    /**
     * Creates a new instance of the type.
     * @param organizationService The `OrganizationService` instance.
     */
    public constructor(organizationService: OrganizationService)
    {
        this._organizationService = organizationService;
    }

    private readonly _organizationService: OrganizationService;

    /**
     * The teams for which data should be presented, or undefined if not yet fetched.
     */
    public accessibleTeams: (OrganizationTeam | "no-team")[] | undefined;

    /**
     * The IDs of the teams for which data should be presented, or undefined if no team is selected.
     */
    public selectedTeamIds: (string | "no-team")[] | undefined;

    /**
     * The teams for which data should be presented, or undefined if no team is selected.
     */
    @computedFrom("selectedTeamIds.length", "accessibleTeams.length")
    public get selectedTeams(): (OrganizationTeam | "no-team")[] | undefined
    {
        if (this.selectedTeamIds == null || this.accessibleTeams == null)
        {
            return undefined;
        }

        return this.selectedTeamIds
            .map(teamId => teamId === "no-team" ? "no-team" : this.accessibleTeams!.find(team => (team as OrganizationTeam).id === teamId)!)
            .filter(team => team != null);
    }

    /**
     * Fetches the teams accessible to the current user, within the current organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the teams.
     */
    public async fetchAccessibleTeams(signal?: AbortSignal): Promise<void>
    {
        const accessibleTeams = await this._organizationService.getAccessibleTeams(signal);

        this.accessibleTeams = ["no-team", ...accessibleTeams];
    }

    /**
     * Resets the state of the service.
     */
    public reset(): void
    {
        this.selectedTeamIds = undefined;
        this.accessibleTeams = undefined;
    }
}
