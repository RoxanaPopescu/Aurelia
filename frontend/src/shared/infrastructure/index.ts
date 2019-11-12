import { FrameworkConfiguration } from "aurelia-framework";
import { HistoryHelper } from "./history";
import { LogNavigation } from "./logging";

/**
 * Configures the feature.
 * @param use The `FrameworkConfiguration` instance.
 */
export function configure(use: FrameworkConfiguration): void
{
    // Instantiate the history helper, as it needs to track router events.
    use.container.get(HistoryHelper);

    // Instantiate the navigation logger, as it needs to track router events.
    use.container.get(LogNavigation);
}

export * from "./api-client";
export * from "./cookies";
export * from "./logging";
export * from "./history";
export * from "./templating";
export * from "./workers";
