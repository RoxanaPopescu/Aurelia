import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

/**
 * Configures the feature.
 * @param use The `FrameworkConfiguration` instance.
 */
export function configure(use: FrameworkConfiguration): void
{
    use.globalResources(
    [
        // Converters.
        PLATFORM.moduleName("./converters/case/case"),
        PLATFORM.moduleName("./converters/currency/currency"),
        PLATFORM.moduleName("./converters/date/date"),
        PLATFORM.moduleName("./converters/date-range/date-range"),
        PLATFORM.moduleName("./converters/date-time/date-time"),
        PLATFORM.moduleName("./converters/date-time-range/date-time-range"),
        PLATFORM.moduleName("./converters/duration/duration"),
        PLATFORM.moduleName("./converters/list/list"),
        PLATFORM.moduleName("./converters/number/number"),
        PLATFORM.moduleName("./converters/percent/percent"),
        PLATFORM.moduleName("./converters/plural/plural"),
        PLATFORM.moduleName("./converters/relative-date/relative-date"),
        PLATFORM.moduleName("./converters/relative-time/relative-time"),
        PLATFORM.moduleName("./converters/select/select"),
        PLATFORM.moduleName("./converters/time/time"),
        PLATFORM.moduleName("./converters/time-range/time-range"),
        PLATFORM.moduleName("./converters/weekday/weekday")
    ]);
}

// Converters.
export * from "./converters/case/case";
export * from "./converters/currency/currency";
export * from "./converters/date/date";
export * from "./converters/date-range/date-range";
export * from "./converters/date-time/date-time";
export * from "./converters/date-time-range/date-time-range";
export * from "./converters/duration/duration";
export * from "./converters/list/list";
export * from "./converters/number/number";
export * from "./converters/percent/percent";
export * from "./converters/plural/plural";
export * from "./converters/relative-date/relative-date";
export * from "./converters/relative-time/relative-time";
export * from "./converters/select/select";
export * from "./converters/time/time";
export * from "./converters/time-range/time-range";
export * from "./converters/weekday/weekday";

// Services.
export * from "./services/locale";
export * from "./services/currency";

// Types.
export * from "./types/date-format";
export * from "./types/time-format";
