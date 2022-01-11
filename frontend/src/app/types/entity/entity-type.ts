import entityTypeNames from "./resources/strings/entity-type-names.json";
import entityTypeGroups from "./resources/strings/entity-type-groups.json";

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
            name: entityTypeNames.unknown,
            group: entityTypeGroups.unknown,
            icon: undefined
        },
        "organization":
        {
            name: entityTypeNames.organization,
            group: entityTypeGroups.organization,
            icon: "md-domain"
        },
        "user":
        {
            name: entityTypeNames.user,
            group: entityTypeGroups.user,
            icon: "md-person"
        },
        "team":
        {
            name: entityTypeNames.team,
            group: entityTypeGroups.team,
            icon: "departments"
        },
        "role":
        {
            name: entityTypeNames.role,
            group: entityTypeGroups.role,
            icon: "md-rules"
        },
        "connection":
        {
            name: entityTypeNames.connection,
            group: entityTypeGroups.connection,
            icon: "md-hub"
        },
        "driver":
        {
            name: entityTypeNames.driver,
            group: entityTypeGroups.driver,
            icon: "fleet"
        },
        "vehicle":
        {
            name: entityTypeNames.vehicle,
            group: entityTypeGroups.vehicle,
            icon: "vehicles"
        },
        "order":
        {
            name: entityTypeNames.order,
            group: entityTypeGroups.order,
            icon: "orders"
        },
        "route":
        {
            name: entityTypeNames.route,
            group: entityTypeGroups.route,
            icon: "routes"
        },
        "route-template":
        {
            name: entityTypeNames.routeTemplate,
            group: entityTypeGroups.routeTemplate,
            icon: "templates"
        },
        "route-plan":
        {
            name: entityTypeNames.routePlan,
            group: entityTypeGroups.routePlan,
            icon: "route-planning"
        },
        "route-planning-rule-set":
        {
            name: entityTypeNames.routePlanningRuleSet,
            group: entityTypeGroups.routePlanningRuleSet,
            icon: "settings"
        },
        "order-group":
        {
            name: entityTypeNames.orderGroup,
            group: entityTypeGroups.orderGroup,
            icon: "order-groups"
        },
        "automatic-dispatch-settings":
        {
            name: entityTypeNames.automaticDispatchRuleSet,
            group: entityTypeGroups.automaticDispatchRuleSet,
            icon: "settings"
        },
        "distribution-center":
        {
            name: entityTypeNames.distributionCenter,
            group: entityTypeGroups.distributionCenter,
            icon: "depots"
        },
        "communication-trigger":
        {
            name: entityTypeNames.communicationTrigger,
            group: entityTypeGroups.communicationTrigger,
            icon: "communication"
        }
    };
}
