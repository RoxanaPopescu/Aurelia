import { Duration } from "luxon";
import { Location } from "app/model/shared";
import { Consignee } from "app/model/outfit";
import { RouteStopType } from "app/model/route";
import requirementNames from "./resources/strings/requirement-names.json"

/**
 * Represents a stop defined in a route template.
 */
export class RouteTemplateStop
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.location = new Location(data.location);
            this.type = new RouteStopType(data.type);
            this.consignee = new Consignee(data.consignee);
            this.requirements = data.requirements;
            this.instructions = data.instructions;
            this.port = data.port;
            this.arrivalTime = Duration.fromObject({ seconds: data.arrivalTime });
            this.departureTime = Duration.fromObject({ seconds: data.departureTime });
        }
        else
        {
            this.location = new Location();
            this.consignee = new Consignee();
            this.requirements =
            {
                photo: false,
                signature: false,
                scanColli: false,
                verifyTimeframe: false,
                customerCode: false,
                acceptInstructions: false
            };
        }
    }

    /**
     * The location of the stop.
     */
    public location: Location;

    /**
     * The type of the stop.
     */
    public type: RouteStopType;

    /**
     * The consignee associated witht the stop.
     */
    public consignee: Consignee;

    /**
     * The requirements associated with the stop.
     */
    public requirements:
    {
        photo: boolean;
        signature: boolean;
        scanColli: boolean;
        verifyTimeframe: boolean;
        customerCode: boolean;
        acceptInstructions: boolean;
    };

    /**
     * The instructions associated with the stop.
     */
    public instructions: string | undefined;

    /**
     * The port the driver should use, if any.
     */
    public port: number | undefined;

    /**
     * The time at which the driver is expected to arrive at the stop.
     */
    public arrivalTime: Duration | undefined;

    /**
     * The time at which the driver is expected to depart from the stop.
     */
    public departureTime: Duration | undefined;

    /**
     * Gets the localized names of the active requirements.
     */
    public get activeRequirementNames(): string[]
    {
        return Object.keys(this.requirements).filter(key => this.requirements[key]).map(key => requirementNames[key]);
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            location: this.location,
            type: this.type.slug,
            consigneeId: this.consignee.id,
            requirements: this.requirements,
            port: this.port,
            arrivalTime: this.arrivalTime,
            departureTime: this.departureTime
        };
    }
}
