import { FrameworkConfiguration } from "aurelia-framework";
import { DeviceService } from "./device";
import { HistoryHelper } from "./history";
import { LogNavigation } from "./logging";

/**
 * Configures the feature.
 * @param use The `FrameworkConfiguration` instance.
 */
export function configure(use: FrameworkConfiguration): void
{
    // Instantiate services.
    use.container.get(DeviceService);
    use.container.get(HistoryHelper);
    use.container.get(LogNavigation);
}

export * from "./api-client";
export * from "./cookies";
export * from "./history";
export * from "./logging";
export * from "./prerender";
export * from "./templating";
export * from "./workers";
