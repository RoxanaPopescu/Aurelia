import { autoinject } from "aurelia-framework";
import { OrganizationService, OrganizationTeam } from "app/model/organization";

/**
 * Represents a service for managing the global teams filter.
 */
@autoinject
export class TeamFilterService
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
     * The teams for which data should be presented, or undefined if no team is selected.
     */
    public selectedTeams: (OrganizationTeam | "no-team")[] | undefined;

    /**
     * The teams for which data should be presented, or undefined if no team is selected.
     */
    public accessibleTeams: (OrganizationTeam | "no-team")[] | undefined;

    /**
     * The selcted teams, formatted as a query value.
     */
    public toQueryValue(): string[] | undefined
    {
        return this.selectedTeams?.map(team => team === "no-team" ? "no-team" : team.id);
    }

    /**
     * The teams for which data should be presented, or undefined if no team is selected.
     */
    public fromQueryValue(value: string): void
    {
        if (this.accessibleTeams == null)
        {
            throw Error("Cannot set selected teams before teams are fetched.");
        }

        this.selectedTeams = value
            .split(",")
            .map(teamId => teamId === "no-team" ? "no-team" : this.accessibleTeams!.find(team => (team as OrganizationTeam).id === teamId)!)
            .filter(team => team != null);
    }

    /**
     * Fetches the teams accessible to the current user, within the current organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved when the operation succeeds.
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
        this.selectedTeams = undefined;
        this.accessibleTeams = undefined;
    }
}
