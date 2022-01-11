import { EntityType, EntityTypeSlug } from "./entity-type";
import { MapObject } from "shared/types";

/**
 * Represents the data needed to create a new instance of the type `EntityInfo`.
 */
export type EntityInfoData =
    Pick<EntityInfo, "id"> &
    Partial<Omit<EntityInfo, "type" | "parent">> &
    { type: EntityType | EntityTypeSlug; parent?: EntityInfo | EntityInfoData };

/**
 * Represents info about an entity.
 */
export class EntityInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: EntityInfoData)
    {
        this.type = typeof data.type === "string" ? new EntityType(data.type) : data.type;
        this.id = data.id;
        this.slug = data.slug;
        this.name = data.name;
        this.description = data.description;
        this.data = data.data;
        this.starred = data.starred;

        if (data.parent)
        {
            this.parent = new EntityInfo(data.parent);
        }

        this.starred = data.starred != null
            ? data.starred

            // HACK: Require is needed to avoid circular imports.
            // tslint:disable-next-line: no-require-imports
            : require("app/modules/starred/services/starred-item").isEntityStarred(this.type.slug, this.id);

        this.url = data.url != null
            ? (data.url || undefined)
            : this.resolveUrl();

        this.starId = data.starId != null
            ? (data.starId || undefined)
            : this.resolveStarId();
    }

    /**
     * The type of the entity.
     */
    public type: EntityType;

    /**
     * The ID of the entity.
     */
    public id: string;

    /**
     * The slug, code or id to use in a URL referencing the entity, or undefined if not relevant.
     */
    public slug: string | undefined;

    /**
     * The entity name, an excerpt of its content, or undefined if not relevant.
     */
    public name: string | undefined;

    /**
     * The entity description, an excerpt of its content, or undefined if not relevant.
     */
    public description: string | undefined;

    /**
     * The additional data describing the entity, or undefined if not relevant.
     */
    public data: MapObject | undefined;

    /**
     * True if the entity is starred, false if the entity is unstarred,
     * or undefined if the entity cannot be starred.
     */
    public starred: boolean | undefined;

    /**
     * The parent entity info, or undefined if the entity has no parent.
     */
    public parent: EntityInfo | undefined;

    /**
     * The URL to use when navigating to the entity,
     * or undefined if the entity has no URL.
     */
    public url: string | undefined;

    /**
     * The ID to use when starring or unstarring the entity,
     * or undefined if the entity cannot be starred.
     */
    public starId: string | undefined;

    /**
     * Resolves the URL to use when navigating to the entity.
     * @returns The resolved URL, or undefined if the entity has no URL.
     */
    private resolveUrl(): string | undefined
    {
        switch (this.type.slug)
        {
            case "organization":
                return undefined;

            // TODO: How do we link to the specified user?
            case "user":
                return "/organization/users";

            case "team":
                return `/organization/teams/${this.id}`;

            // TODO: How do we link to the specified connection?
            case "role":
                return "/organization/roles";

            // TODO: How do we link to the specified connection?
            case "connection":
                return "/organization/connections";

            case "driver":
                return `/fleet-management/drivers/details/${this.id}`;

            // TODO: How do we link to the specified vehicle?
            case "vehicle":
                return "/fleet-management/vehicles";

            case "order":
                return `/orders/details/${this.slug}`;

            case "route":
                return `/routes/details/${this.slug}`;

            case "route-template":
                return `/routes/templates/details/${this.slug}`;

            case "route-plan":
                return `/route-planning/plans/details/${this.slug}`;

            case "route-planning-rule-set":
                return `/route-planning/rule-sets/details/${this.slug}`;

            case "order-group":
                return `/route-planning/order-groups/details/${this.id}`;

            case "automatic-dispatch-settings":
                return `/dispatch/rule-sets/details/${this.id}`;

            case "distribution-center":
                return `/distribution-centers/details/${this.id}`;

            case "communication-trigger":
                return `/communication/details/${this.slug}`;

            default:
                return undefined;
        }
    }

    /**
     * Resolves the ID to use when starring or unstarring the entity.
     * @returns The resolved star ID, or undefined if the entity cannot be starred.
     */
    private resolveStarId(): string | undefined
    {
        return `${this.type.slug}/${this.id}`;
    }
}
