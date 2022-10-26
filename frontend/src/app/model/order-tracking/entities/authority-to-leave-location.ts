import authorityToLeaveLocations from "../resources/strings/authority-to-leave-locations.json";

/**
 * Represents the slug identifying a `AuthorityToLeaveLocation`.
 */
export type AuthorityToLeaveLocationSlug = keyof typeof AuthorityToLeaveLocation.values;

/**
 * Represents a standard location at which the customer may grant the driver permission to leave their delivery.
 */
export class AuthorityToLeaveLocation
{
    public constructor(slug: AuthorityToLeaveLocationSlug)
    {
        this.slug = slug;
        Object.assign(this, AuthorityToLeaveLocation.values[this.slug]);
    }

    public slug: AuthorityToLeaveLocationSlug;
    public name: string;
    public value: number;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return this.slug;
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "inFrontOfTheFrontDoor":
        {
            slug: "inFrontOfTheFrontDoor",
            name: authorityToLeaveLocations.inFrontOfTheFrontDoor
        },
        "atTheBackDoor":
        {
            slug: "atTheBackDoor",
            name: authorityToLeaveLocations.atTheBackDoor
        },
        "inTheGarage":
        {
            slug: "inTheGarage",
            name: authorityToLeaveLocations.inTheGarage
        },
        "inTheCarport":
        {
            slug: "inTheCarport",
            name: authorityToLeaveLocations.inTheCarport
        },
        "onTheTerrace":
        {
            slug: "onTheTerrace",
            name: authorityToLeaveLocations.onTheTerrace
        },
        "inTheGardenShed":
        {
            slug: "inTheGardenShed",
            name: authorityToLeaveLocations.inTheGardenShed
        },
        "inTheGreenhouse":
        {
            slug: "inTheGreenhouse",
            name: authorityToLeaveLocations.inTheGreenhouse
        },
        "underTheCanopy":
        {
            slug: "underTheCanopy",
            name: authorityToLeaveLocations.underTheCanopy
        },
        "inTheParcelMailbox":
        {
            slug: "inTheParcelMailbox",
            name: authorityToLeaveLocations.inTheParcelMailbox
        }
    };
}
