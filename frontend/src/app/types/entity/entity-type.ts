import strings from "./resources/strings/entity-type.json";

/**
 * Represents the slug identifying a `EntityType`.
 */
export type EntityTypeSlug = keyof typeof EntityType.values;

/**
 * Represents a type of entity within the domain.
 */
export class EntityType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the entity type.
     */
    public constructor(slug: EntityTypeSlug)
    {
        this.slug = slug;
        Object.assign(this, EntityType.values[this.slug] || EntityType.values.unknown);
    }

    /**
     * The slug identifying the entity type.
     */
    public slug: EntityTypeSlug;

    /**
     * The localized name of the entity type.
     */
    public name: string;

    /**
     * The name of the icon representing the entity type.
     */
    public icon: string | undefined;

    /**
     * The available values.
     */
    public static readonly values =
    {
        "unknown":
        {
            name: strings.unknown,
            icon: undefined
        },
        "organization":
        {
            name: strings.organization,
            icon: "md-domain"
        },
        "user":
        {
            name: strings.user,
            icon: "md-person"
        },
        "team":
        {
            name: strings.team,
            icon: "departments"
        },
        "role":
        {
            name: strings.role,
            icon: "md-rules"
        },
        "connection":
        {
            name: strings.connection,
            icon: "md-hub"
        },
        "driver":
        {
            name: strings.driver,
            icon: "fleet"
        },
        "vehicle":
        {
            name: strings.vehicle,
            icon: "vehicles"
        },
        "order":
        {
            name: strings.order,
            icon: "orders"
        },
        "route":
        {
            name: strings.route,
            icon: "routes"
        },
        "route-template":
        {
            name: strings.routeTemplate,
            icon: "templates"
        },
        "route-plan":
        {
            name: strings.routePlan,
            icon: "route-planning"
        },
        "rule-set":
        {
            name: strings.ruleSet,
            icon: "settings"
        },
        "order-group":
        {
            name: strings.orderGroup,
            icon: "order-groups"
        },
        "distribution-center":
        {
            name: strings.distributionCenter,
            icon: "depots"
        },
        "communication-trigger":
        {
            name: strings.communicationTrigger,
            icon: "communication"
        }
    };
}
