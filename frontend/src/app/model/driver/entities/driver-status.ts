import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";
import driverStatus from "../resources/strings/driver-status.json"

/**
 * Represents the slug identifying a `DriverStatus`.
 */
export type DriverStatusSlug = keyof typeof DriverStatus.values;

/**
 * Represents the status of a Driver.
 */
export class DriverStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the Driver.
     */
    public constructor(slug: DriverStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, DriverStatus.values[this.slug]);
    }

    public slug: DriverStatusSlug;
    public name: string;
    public accent: Accent;

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
        "approved":
        {
            name: driverStatus.approved,
            accent: "positive"
        },
        "not-approved":
        {
            name: driverStatus.notApproved,
            accent: "neutral"
        },
        "waiting-for-approval":
        {
            name: driverStatus.waitingForApproval,
            accent: "neutral"
        },
        "banned":
        {
            name: driverStatus.banned,
            accent: "negative"
        }
    };
}
