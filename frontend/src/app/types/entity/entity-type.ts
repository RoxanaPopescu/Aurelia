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
            icon: "ico-organization"
        },
        "user":
        {
            name: entityTypeNames.user,
            group: entityTypeGroups.user,
            icon: "ico-person"
        },
        "team":
        {
            name: entityTypeNames.team,
            group: entityTypeGroups.team,
            icon: "ico-departments"
        },
        "role":
        {
            name: entityTypeNames.role,
            group: entityTypeGroups.role,
            icon: "ico-rules"
        },
        "connection":
        {
            name: entityTypeNames.connection,
            group: entityTypeGroups.connection,
            icon: "ico-hub"
        },
        "driver":
        {
            name: entityTypeNames.driver,
            group: entityTypeGroups.driver,
            icon: "ico-fleet"
        },
        "vehicle":
        {
            name: entityTypeNames.vehicle,
            group: entityTypeGroups.vehicle,
            icon: "ico-vehicles"
        },
        "order":
        {
            name: entityTypeNames.order,
            group: entityTypeGroups.order,
            icon: "ico-orders"
        },
        "route":
        {
            name: entityTypeNames.route,
            group: entityTypeGroups.route,
            icon: "ico-routes"
        },
        "route-template":
        {
            name: entityTypeNames.routeTemplate,
            group: entityTypeGroups.routeTemplate,
            icon: "ico-templates"
        },
        "route-plan":
        {
            name: entityTypeNames.routePlan,
            group: entityTypeGroups.routePlan,
            icon: "ico-route-planning"
        },
        "route-planning-rule-set":
        {
            name: entityTypeNames.routePlanningRuleSet,
            group: entityTypeGroups.routePlanningRuleSet,
            icon: "ico-gear"
        },
        "order-group":
        {
            name: entityTypeNames.orderGroup,
            group: entityTypeGroups.orderGroup,
            icon: "ico-order-groups"
        },
        "automatic-dispatch-rule-set":
        {
            name: entityTypeNames.automaticDispatchRuleSet,
            group: entityTypeGroups.automaticDispatchRuleSet,
            icon: "ico-gear"
        },
        "distribution-center":
        {
            name: entityTypeNames.distributionCenter,
            group: entityTypeGroups.distributionCenter,
            icon: "ico-depots"
        },
        "communication-trigger":
        {
            name: entityTypeNames.communicationTrigger,
            group: entityTypeGroups.communicationTrigger,
            icon: "ico-communication"
        }
    };
}
