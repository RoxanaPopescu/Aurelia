import { Duration } from "luxon";

export class AutomaticDispatchStartManual
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor()
    {
        this.filters = new AutomaticDispatchStartManualFilters();
    }

    /**
     * The filters when starting manual automatic dispatch.
     */
    public filters: AutomaticDispatchStartManualFilters;
}

export class AutomaticDispatchStartManualFilters
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor()
    {
        this.shipments = new AutomaticDispatchStartManualFiltersShipments();
    }

    /**
     * The shipment filters.
     */
    public shipments: AutomaticDispatchStartManualFiltersShipments;

    /**
     * The route filters.
     */
    public routes: AutomaticDispatchStartManualFiltersRoutes;
}

export class AutomaticDispatchStartManualFiltersShipments
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor()
    {
        this.organizationIds = [];
        this.vehicleTypes = [];
    }

    /**
     * The organization ids to filter.
     */
    public organizationIds: string[];

    /**
     * The vehicle types to filter.
     */
    public vehicleTypes: string[];

    /**
     * The pickup duration we search with.
     */
    public pickupTime?: Duration;
}

export class AutomaticDispatchStartManualFiltersRoutes
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor()
    {
        this.organizationIds = [];
        this.tags = [];
    }

    /**
     * The organization ids to filter.
     */
    public organizationIds: string[];

    /**
     * The tags to filter with.
     */
    public tags: string[];

    /**
     * The pickup duration we search with.
     */
    public pickupTime?: Duration;
}
