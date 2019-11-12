import { RouteTemplateInfo } from "./route-template-info";

/**
 * Represents details about a route template.
 */
export class RouteTemplate extends RouteTemplateInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        super(data);
    }
}
