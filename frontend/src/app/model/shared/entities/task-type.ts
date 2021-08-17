import { textCase } from "shared/utilities/text";
import taskTypeNames from "../resources/strings/task-type-names.json";

/**
 * Represents the slug identifying a `TaskType`.
 */
export type TaskTypeSlug = keyof typeof TaskType.values;

/**
 * Represents the type of a route stop.
 */
export class TaskType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the type of the route stop.
     */
    public constructor(slug: TaskTypeSlug)
    {
        this.slug = slug ? textCase(slug, "pascal", "kebab") as any : "pickup";
        Object.assign(this, TaskType.values[this.slug]);
    }

    public slug: TaskTypeSlug;
    public name: string;

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
        "photo":
        {
            name: taskTypeNames.photo,
            description: "Requiring the driver to take a picture at the stop of the colli."
        },
        "signature":
        {
            name: taskTypeNames.signature,
            description: "Requiring the driver to get a signature from the contact person at the stop."
        },
        "timeframe-verification":
        {
            name: taskTypeNames.timeframeVerification,
            description: "If the system determines that the driver will be late on the stop, we will make the driver extra aware on the situation."
        },
        "contact-code":
        {
            name: taskTypeNames.contactCode,
            description: "The contact has to give a code to the driver on arrival before the driver can continue."
        },
        "instructions-accept":
        {
            name: taskTypeNames.instructionsAccept,
            description: "To ensure that the driver has read the instructions, it will be shown to him on arrival."
        },
        "colli-count":
        {
            name: taskTypeNames.colliCount,
            description: "For the validation of colli without barcodes, you can require the driver to verify the colli count on the stop. This feature works best alongside 'Signature'"
        },
        "colli-scan":
        {
            name: taskTypeNames.colliScan,
            description: "The driver has to scan colli on the stop, if they have barcodes."
        }
    };
}
