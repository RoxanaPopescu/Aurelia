/**
 * Represents the slug identifying a `UturnStrategy`.
 */
export type RequestTemplatesName = keyof typeof RequestTemplate.values;

/**
 * Represents a U-turn strategy used during route optimization.
 */
export class RequestTemplate
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(template: RequestTemplatesName)
    {
        this.id = template;
        Object.assign(this, RequestTemplate.values[template]);
    }

    public id: RequestTemplatesName;
    public name: string;
    public requestId: string;
    public description: string;

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "ikea-flow1":
        {
            name: "IKEA flow 1",
            requestId: "447280",
            description: "Description 1"
        },
        "ikea-flow2":
        {
            name: "IKEA flow 2",
            requestId: "447280",
            description: "Description 2"
        }
    };
}
