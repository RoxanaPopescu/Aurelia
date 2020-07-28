import { autoinject } from "aurelia-framework";
import { textCase } from "shared/utilities";
import * as platforms from "./detectors/platforms";
import * as features from "./detectors/features";

/**
 * Represents a service that provides info about the device on which the app is running.
 */
@autoinject
export class DeviceService
{
    /**
     * Creates a new instance of the class.
     */
    public constructor()
    {
        // Execute detectors.
        this.platform = this.detectOne(platforms);
        this.features = this.detectAll(features);

        // Add class names to the `html` element.
        const classNames =
        [
            this.platform ? `platform-${this.formatClassName(this.platform)}` : "",
            ...Object.keys(this.features).map(name => `feature-${this.features[name] ? "" : "no-"}${this.formatClassName(name)}`)
        ];

        document.documentElement.className += ` ${classNames.filter(name => name).join(" ")}`;
    }

    /**
     * Gets the platform, if successfully detected.
     */
    public readonly platform: keyof typeof platforms | null | undefined;

    /**
     * Gets an object representing the availability of specific feature.
     */
    public readonly features: { [name in keyof typeof features]: boolean };

    /**
     * Executes all detectors in the specified detector module, returning all results.
     * @param detectorModule The module implementing the detectors.
     * @returns An object in which keys represent the detectors, and values represent the detection result.
     */
    private detectAll<T extends {}>(detectorModule: T): { [K in keyof T]: boolean }
    {
        const result = {} as any;

        Object.keys(detectorModule).forEach(key =>
            result[key] = detectorModule[key] instanceof Function ? detectorModule[key](this) : detectorModule[key]);

        return result;
    }

    /**
     * Executes all detectors in the specified detector module, returning a single result.
     * @param detectorModule The module implementing the detectors.
     * @returns The name of the single detector that matched, or null if no detectors matched.
     * If more than one detector matched, undefined is returned.
     */
    private detectOne(detectorModule: object): keyof typeof detectorModule | null | undefined
    {
        const matches = Object.keys(detectorModule).filter(key =>
            detectorModule[key] instanceof Function ? detectorModule[key](this) : detectorModule[key]);

        return (matches.length === 1 ? matches[0] : matches.length === 0 ? null : undefined) as any;
    }

    /**
     * Formats the specified detector name as a class name.
     * @param detectorName The detector name to format.
     * @returns The detector name formatted as kebab case, or `unknown` if null or undefined.
     */
    private formatClassName(detectorName: string): string
    {
        return detectorName ? textCase(detectorName, "camel", "kebab") : "unknown";
    }
}
