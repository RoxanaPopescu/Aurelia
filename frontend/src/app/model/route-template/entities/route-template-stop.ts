import { TimeRange } from "shared/types/index";
import { Consignee } from "app/model/outfit";
import { Location } from "app/model/shared";
import { RouteStopType } from "app/model/route";
import requirementNames from "./resources/strings/requirement-names.json";

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
            this.driverInstructions = data.driverInstructions;
            this.gate = data.gate;
            this.arrivalTimeFrame = new TimeRange(data.arrivalTimeFrame);
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
            this.arrivalTimeFrame = new TimeRange();
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
    public driverInstructions: string | undefined;

    /**
     * The gate the driver should use, if any.
     */
    public gate: number | undefined;

    /**
     * The time frame within which the driver is should arrive at the stop.
     */
    public arrivalTimeFrame: TimeRange | undefined;

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
            instructions: this.driverInstructions,
            port: this.gate,
            arrivalTimeFrame: this.arrivalTimeFrame
        };
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return new RouteTemplateStop(JSON.parse(JSON.stringify(
        {
            location: this.location,
            type: this.type.slug,
            consignee: this.consignee,
            requirements: this.requirements,
            instructions: this.driverInstructions,
            port: this.gate,
            arrivalTimeFrame: this.arrivalTimeFrame
        })));
    }
}
