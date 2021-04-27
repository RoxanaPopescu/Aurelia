import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

/**
 * Configures the feature.
 * @param use The `FrameworkConfiguration` instance.
 */
export function configure(use: FrameworkConfiguration): void
{
    use.globalResources(
    [
        // Components
        PLATFORM.moduleName("./components/google-map/google-map"),
        PLATFORM.moduleName("./components/google-map/google-map-marker"),
        PLATFORM.moduleName("./components/google-map/google-map-line"),
        PLATFORM.moduleName("./components/google-map/google-map-popover")
    ]);
}

// Components
export * from "./components/google-map/google-map";
export * from "./components/google-map/google-map-object";
export * from "./components/google-map/google-map-marker";
export * from "./components/google-map/google-map-line";
export * from "./components/google-map/google-map-popover";

// Services
export * from "./services/google-maps";
