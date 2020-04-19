/**
 * Represents the slug identifying a `UturnStrategy`.
 */
export type RequestTemplatesName = keyof typeof RequestTemplate.values;

/**
 * Represents a template for a request.
 */
export class RequestTemplate
{
    /**
     * Creates a new instance of the type.
     * @param template The template of the request.
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
            requestId: "510627",
            description: "Custom flows for IKEA"
        },
        "ikea-flow2":
        {
            name: "IKEA flow 2",
            requestId: "510630",
            description: "Custom flows for IKEA"
        },
        "ikea-flow3":
        {
            name: "IKEA flow 3",
            requestId: "510634",
            description: "Custom flows for IKEA"
        },
        "ikea-flow4":
        {
            name: "IKEA flow 4",
            requestId: "510635",
            description: "Custom flows for IKEA"
        },
        "ikea-flow5":
        {
            name: "IKEA flow 5",
            requestId: "510638",
            description: "Custom flows for IKEA"
        }
    };
}
