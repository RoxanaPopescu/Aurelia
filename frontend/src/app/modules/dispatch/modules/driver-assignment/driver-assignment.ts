import { autoinject, observable, computedFrom } from "aurelia-framework";
import { ISorting, IPaging } from "shared/types";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { RouteService, RouteInfo, RouteAssignmentService, RouteAssignDriver } from "app/model/route";
import { DateTime } from "luxon";
import { AssignDriverPanel } from "../../../routes/modals/assign-driver/assign-driver";
import { AssignVehiclePanel } from "../../../routes/modals/assign-vehicle/assign-vehicle";
import { AssignTeamPanel } from "../../../routes/modals/assign-team/assign-team";
import { AssignOrganizationPanel } from "../../../routes/modals/assign-organization/assign-organization";
import { RouteListColumn } from "app/model/route/entities/route-list-column";
import { OrganizationService, OrganizationTeam } from "app/model/organization";
import { TeamsFilterService } from "app/services/teams-filter";
import { Fulfiller } from "app/model/outfit";
import { ConfirmAssignmentDialog } from "./modals/confirm-assignment/confirm-assignment";
import { ConfirmReassignmentDialog } from "./modals/confirm-reassignment/confirm-reassignment";
import { DriverService } from "app/model/driver";
import { InvalidAssignmentDialog } from "./modals/invalid-assignment/invalid-assignment";

/**
 * Represents the page.
 */
@autoinject
export class DriverAssignmentPage
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param modalService The `ModalService` instance.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param teamsFilterService The `TeamsFilterService` instance.
     * @param driverService The `DriverService` instance.
     */
    public constructor(
        routeService: RouteService,
        routeAssignmentService: RouteAssignmentService,
        modalService: ModalService,
        organizationService: OrganizationService,
        teamsFilterService: TeamsFilterService,
        driverService: DriverService)
    {
        this._routeService = routeService;
        this._modalService = modalService;
        this._routeAssignmentService = routeAssignmentService;
        this._organizationService = organizationService;
        this.teamsFilterService = teamsFilterService;
        this._driverService = driverService;
        this._constructed = true;
    }

    private readonly _routeService: RouteService;
    private readonly _modalService: ModalService;
    private readonly _organizationService: OrganizationService;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _driverService: DriverService;
    private readonly _constructed;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The day to show for.
     */
    @observable({ changeHandler: "update" })
    protected dateFilter: DateTime = DateTime.local();

    /**
     * The `TeamsFilterService` instance.
     */
    protected readonly teamsFilterService: TeamsFilterService;

    /**
     * The teams for the organization
     */
    protected teams: OrganizationTeam[] = [];

    /**
     * The routes to assign drivers to
     */
    protected results: RouteAssignDriver[] = [];

    /**
     * The custom grid column widths calculated from the columns
     */
    @computedFrom("columns")
    protected get tableStyleRoutes(): any
    {
        return { "grid-template-columns": `${this.columns.map(c => c.width).join(" ")} min-content` };
    }

    /**
     * The custom grid column widths calculated from the columns
     */
    @computedFrom("columns")
    protected get tableStyle(): any
    {
        return { "grid-template-columns": `${this.columns.map(c => c.width).join(" ")} min-content min-content` };
    }

    /**
     * The current columns to show in the list
     */
    @computedFrom("customColumns")
    protected get columns(): RouteListColumn[]
    {
        return [
            new RouteListColumn("start-address"),
            new RouteListColumn("owner"),
            new RouteListColumn("slug"),
            new RouteListColumn("reference"),
            new RouteListColumn("stop-count"),
            new RouteListColumn("complexity"),
            new RouteListColumn("estimated-colli-count"),
            new RouteListColumn("distance"),
            new RouteListColumn("estimated-time-frame"),
            new RouteListColumn("status"),
            new RouteListColumn("vehicle-type"),
            new RouteListColumn("driver"),
            new RouteListColumn("driver-id")
        ];
    }

    /**
     * The sorting to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected sorting: ISorting =
    {
        property: "start-date",
        direction: "descending"
    };

    /**
     * The paging to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected paging: IPaging =
    {
        page: 1,
        pageSize: 30
    };

    /**
     * True if we show the preview of changes
     */
    protected showPreview: boolean = true;

    /**
     * True if we are assigning the drivers
     */
    protected assigningDrivers: boolean = false;

    /**
     * True if initial loading failed
     */
    protected failed: boolean = false;

    /**
     * The legacy owner IDs to show, only used by Mover Transport in a transition phase.
     */
    @observable({ changeHandler: "update" })
    protected legacyOwnerIdsFilter: any[] | undefined;

    /**
     * The IDs of the teams for which data should be presented, or undefined if no team is selected.
     */
    @observable({ changeHandler: "update" })
    protected teamsFilter: ("no-team" | string)[] | undefined;

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected routeCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected routeResults: RouteInfo[] | undefined;

    /**
     * Called by the framework when the module is activated.
     */
    public activate(): void
    {
        this.teamsFilter = this.teamsFilterService.selectedTeamIds;
        this.teamsFilterService.fetchAccessibleTeams().catch(error => Log.error(error));
        this.update();
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

    /**
     * Called when the user selects the route to show the driver list url from
     */
    public onShowDriverLink(route: RouteInfo): void
    {
        window.open(route.driverListUrl, "_blank");
    }

    /**
     * Called from the table when team is being represented
     */
    public teamName(teamId?: string): string | undefined
    {
        if (teamId == null)
        {
            return undefined;
        }

        return this.teams.find(t => t.id === teamId)?.name;
    }

    /**
     * Called from the table when delayed stops are being represented
     */
    public delayedStops(route: RouteInfo): string | undefined
    {
        if (route.delayedStopIndexes)
        {
            return route.delayedStopIndexes.map(d => d + 1).join(", ");
        }

        return undefined;
    }

    /**
     * Called when the `Hide preview` button is clicked.
     * Will show and hide the preview.
     */
    protected onTogglePreviewClick(): void
    {
        this.showPreview = !this.showPreview;
    }

    /**
     * Called when the remove result button is clicked.
     * Will remove the driver to be assigned.
     */
    protected onRemoveClick(result: RouteAssignDriver): void
    {
        const index = this.results.indexOf(result);
        this.results.splice(index, 1);
    }

    /**
     * Called when the driver ID input has changes.
     * Fetches the driver and will add him to the preview
     */
    protected async onDriverIdChanged(route: RouteInfo): Promise<void>
    {
        const driverId = (route as any).driverId;

        if (driverId == null || driverId.length <= 0)
        {
            // Remove current if found
            const index = this.results.findIndex(r => r.route.id === route.id);
            route.driver = undefined;

            if (index !== -1)
            {
                this.results.splice(index, 1);
            }

            return;
        }

        try
        {
            const driver = await this._driverService.get(driverId);

            if (driver.status.slug === "approved")
            {
                await this.addResult(new RouteAssignDriver(route, driver));
            }
            else
            {
                (route as any).driverId = undefined;

                this._modalService.open(
                    InvalidAssignmentDialog,
                    `The driver with ID '${driverId}' is not approved`
                );
            }
        }
        catch
        {
            Log.error(`Could not find a driver with ID '${driverId}'`);
            (route as any).driverId = undefined;
        }
    }

    /**
     * Called when the `Assign drivers` button is clicked.
     * Opens the panel for validation for assigning drivers.
     */
    protected async onAssignDriversClick(): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmAssignmentDialog, this.results).promise;

        if (!confirmed)
        {
            return;
        }

        this.assigningDrivers = true;

        try
        {
            const currentResults = [...this.results];

            for (const result of currentResults)
            {
                result.assigning = true;
                await this._routeAssignmentService.assignDriver(result.route, result.driver!);
                this.onRemoveClick(result);
            }
        }
        catch
        {
            Log.error("Could not assign the driver");
        }
        finally
        {
            for (const result of this.results)
            {
                result.assigning = false;
            }

            this.assigningDrivers = false;
            this.update();
        }
    }

    /**
     * Called when the `Assign executor` button is clicked.
     * Opens the panel for assigning a executor to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignExecutorClick(route: RouteInfo, updating: any): Promise<void>
    {
        const executor = await this._modalService.open(
            AssignOrganizationPanel,
            { route: route, assignOnSelect: false }
        ).promise;

        if (executor != null)
        {
            const previousValue = route.executor;
            route.executor = new Fulfiller({ id: executor.organization.id, companyName: executor.organization.name });
            updating.executor = true;

            try
            {
                await this._routeAssignmentService.assignExecutor(route, executor);
            }
            catch
            {
                route.executor = previousValue;
                Log.error(`Could not assign executor '${executor.organization.name}'`);
            }

            updating.executor = false;
        }
    }

    /**
     * Called when the `Assign vehicle` button is clicked.
     * Opens the panel for assigning a vehicle to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignVehicleClick(route: RouteInfo, updating: any): Promise<void>
    {
        const vehicle = await this._modalService.open(
            AssignVehiclePanel,
            { route: route, assignOnSelect: false }
        ).promise;

        if (vehicle != null)
        {
            const previousValue = route.vehicle;
            route.vehicle = vehicle;
            updating.vehicle = true;

            try
            {
                await this._routeAssignmentService.assignVehicle(route, vehicle);
            }
            catch
            {
                route.vehicle = previousValue;
                Log.error(`Could not assign the vehicle '${vehicle.name}'`);
            }

            updating.vehicle = false;
        }
    }

    /**
     * Called when the `Assign driver` button is clicked.
     * Opens the panel for assigning a driver to a route, and once assigned, will add it to the preview.
     */
    protected async onAssignDriverClick(route: RouteInfo): Promise<void>
    {
        const driver = await this._modalService.open(
            AssignDriverPanel,
            { route: route, assignOnSelect: false }
        ).promise;

        if (driver != null)
        {
            await this.addResult(new RouteAssignDriver(route, driver));
        }
    }

    /**
     * Called when the `Assign team` button is clicked.
     * Opens the panel for assigning a team to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignTeamClick(route: RouteInfo, updating: any): Promise<void>
    {
        const result = await this._modalService.open(
            AssignTeamPanel,
            { route: route, assignOnSelect: false }
        ).promise;

        if (result != null)
        {
            const team = result === "no-team" ? undefined : result;

            const previousValue = route.teamId;
            route.teamId = team?.id;
            updating.team = true;

            try
            {
                await this._routeAssignmentService.assignTeam(route, team);
            }
            catch
            {
                route.teamId = previousValue;
                Log.error(`Could not assign the team '${team?.name}''`);
            }

            updating.team = false;
        }
    }

    /**
     * Updates the page by fetching the latest data.
     */
    protected async addResult(result: RouteAssignDriver): Promise<void>
    {
        if (this.assigningDrivers)
        {

            return;
        }

        const sameDriver = this.results.find(r => r.driver?.id === result.driver?.id);
        const sameRoute = this.results.find(r => r.route.slug === result.route.slug);

        if (sameDriver != null && sameRoute != null)
        {
            // Already added
            return;
        }

        // One is the same, inform the user
        if (sameDriver != null || sameRoute != null)
        {
            const assignment = await this._modalService.open(ConfirmReassignmentDialog, { new: result, current: sameDriver ?? sameRoute! }).promise;

            if (assignment === "cancel")
            {
                (result.route as any).driverId = undefined;

                return;
            }

            if (assignment === "re-assign")
            {
                // Remove driver from previous route if re assiging
                if (sameDriver != null)
                {
                    (sameDriver.route as any).driverId = undefined;
                    sameDriver.route.driver = undefined;
                }

                this.onRemoveClick(sameDriver ?? sameRoute!);
            }
        }

        this.results.push(result);
        result.route.driver = result.driver;
        (result.route as any).driverId = result.driver?.id;
    }

    /**
     * Updates the page by fetching the latest data.
     */
    protected update(newValue?: any, oldValue?: any, propertyName?: string): void
    {
        // Return if the object is not constructed.
        // This is needed because the `observable` decorator calls the change handler when the
        // initial property value is set, which happens before the constructor is called.
        if (!this._constructed)
        {
            return;
        }

        // Update the global teams filter.
        this.teamsFilterService.selectedTeamIds = this.teamsFilter;

        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        const columnSlugs = this.columns.map(c => c.slug);

        // Fetch teams if needed
        if (this.teams.length === 0 && columnSlugs.includes("team"))
        {
            // tslint:disable-next-line: no-floating-promises
            (async () =>
            {
                this.teams = await this._organizationService.getTeams();
            })();
        }

        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            this.failed = false;

            try
            {

                const result = await this._routeService.getAll(
                    {
                        assignedDriver: false,
                        statuses: ["not-started", "not-approved"],
                        startTimeFrom: this.dateFilter.startOf("day"),
                        startTimeTo: this.dateFilter.endOf("day"),
                        teams: this.teamsFilterService.selectedTeamIds,
                        legacyOwnerIds: this.legacyOwnerIdsFilter
                    },
                    {
                        owner: true,
                        vehicle: columnSlugs.includes("vehicle"),
                        fulfiller: columnSlugs.includes("executor"),
                        driver: true,
                        tags: columnSlugs.includes("tags"),
                        criticality: true,
                        estimates: columnSlugs.includes("estimated-time-frame"),
                        delayedStops: columnSlugs.includes("delayed-stops"),
                        stops: columnSlugs.includes("distance") || columnSlugs.includes("planned-start-time-frame") || columnSlugs.includes("estimated-colli-count"),
                        colli: columnSlugs.includes("colli-count")
                    },
                    this.sorting,
                    this.paging,
                    signal
                );

                // Update the state.
                this.routeResults = result.routes;
                this.routeCount = result.routeCount;

                // Reset page.
                if (propertyName !== "paging")
                {
                    this.paging.page = 1;
                }

                // Scroll to top.
                this.scroll?.reset();
            }
            catch (error)
            {
                this.failed = true;
                Log.error("An error occurred while loading the list.", error);
            }
        });
    }
}
