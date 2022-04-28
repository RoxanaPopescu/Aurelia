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
            name: distributionCenterRouteRemarks["late-release-pick-of-route"]
        },
        "31":
        {
            name: distributionCenterRouteRemarks["late-route-consolidation"]
        },
        "32":
        {
            name: distributionCenterRouteRemarks["late-route-not-ready-at-ramp"]
        },
        "39":
        {
            name: distributionCenterRouteRemarks["driver-error"]
        },
        "61":
        {
            name: distributionCenterRouteRemarks["route-planning-incorrect"]
        },
        "87":
        {
            name: distributionCenterRouteRemarks["it-system-failure"]
        },
        "92":
        {
            name: distributionCenterRouteRemarks["late-arrival-to-ramp"]
        },
        "93":
        {
            name: distributionCenterRouteRemarks["late-departure-from-ramp"]
        },
        "96":
        {
            name: distributionCenterRouteRemarks["change-of-fulfiller"]
        },
        "99":
        {
            name: distributionCenterRouteRemarks["other"]
        }
    };
}
