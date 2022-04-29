import distributionCenterRouteRemarks from "../resources/strings/distribution-center-route-remarks.json";

/**
 * Represents the slug identifying a `DistributionCenterRouteRemark`.
 */
export type DistributionCenterRouteRemarkSlug = keyof typeof DistributionCenterRouteRemark.values;

/**
 * Represents the method by which a collo was scanned.
 */
export class DistributionCenterRouteRemark
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the collo.
     */
    public constructor(code: number | string)
    {
        this.code = code.toString() as any;
        Object.assign(this, DistributionCenterRouteRemark.values[this.code]);
    }

    public code: DistributionCenterRouteRemarkSlug;
    public name: string;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return parseInt(this.code);
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "26":
        {
            name: distributionCenterRouteRemarks.lateReleasePickOfRoute
        },
        "31":
        {
            name: distributionCenterRouteRemarks.lateRouteConsolidation
        },
        "32":
        {
            name: distributionCenterRouteRemarks.lateRouteNotReadyAtRamp
        },
        "39":
        {
            name: distributionCenterRouteRemarks.driverError
        },
        "61":
        {
            name: distributionCenterRouteRemarks.routePlanningIncorrect
        },
        "87":
        {
            name: distributionCenterRouteRemarks.itSystemFailure
        },
        "92":
        {
            name: distributionCenterRouteRemarks.lateArrivalToRamp
        },
        "93":
        {
            name: distributionCenterRouteRemarks.lateDepartureFromRamp
        },
        "96":
        {
            name: distributionCenterRouteRemarks.changeOfFulfiller
        },
        "99":
        {
            name: distributionCenterRouteRemarks.other
        }
    };
}
