import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";
import { FocusService } from "./services/focus";

/**
 * Configures the feature.
 * @param use The `FrameworkConfiguration` instance.
 */
export function configure(use: FrameworkConfiguration): void
{
    use.globalResources(
    [
        // Components
        PLATFORM.moduleName("./components/behaviors/autofocus/autofocus"),
        PLATFORM.moduleName("./components/behaviors/empty/empty"),
        PLATFORM.moduleName("./components/behaviors/scroll/scroll"),
        PLATFORM.moduleName("./components/behaviors/trap-focus/trap-focus"),
        PLATFORM.moduleName("./components/cards/card/card"),
        PLATFORM.moduleName("./components/cards/card-skeleton/card-skeleton"),
        PLATFORM.moduleName("./components/icons/badge/badge"),
        PLATFORM.moduleName("./components/icons/icon/icon"),
        PLATFORM.moduleName("./components/icons/md-icon/md-icon"),
        PLATFORM.moduleName("./components/icons/md-icon/md-icon-stack"),
        PLATFORM.moduleName("./components/controls/inputs/email-input/email-input"),
        PLATFORM.moduleName("./components/controls/inputs/number-input/number-input"),
        PLATFORM.moduleName("./components/controls/inputs/search-input/search-input"),
        PLATFORM.moduleName("./components/controls/inputs/slug-input/slug-input"),
        PLATFORM.moduleName("./components/controls/inputs/text-input/text-input"),
        PLATFORM.moduleName("./components/controls/inputs/url-input/url-input"),
        PLATFORM.moduleName("./components/controls/navigation/path-nav/path-nav"),
        PLATFORM.moduleName("./components/controls/navigation/tab-nav/tab-nav"),
        PLATFORM.moduleName("./components/controls/navigation/tab-nav/tab"),
        PLATFORM.moduleName("./components/controls/navigation/tree-nav/tree-nav"),
        PLATFORM.moduleName("./components/controls/toolbar/toolbar"),
        PLATFORM.moduleName("./components/controls/toolbar/toolbar-group"),
        PLATFORM.moduleName("./components/data-table/data-table"),
        PLATFORM.moduleName("./components/data-table/data-table-cell"),
        PLATFORM.moduleName("./components/data-table/data-table-headers"),
        PLATFORM.moduleName("./components/data-table/data-table-pager"),
        PLATFORM.moduleName("./components/data-table/data-table-row"),
        PLATFORM.moduleName("./components/data-table/data-table-details"),
        PLATFORM.moduleName("./components/file-dropzone/file-dropzone"),
        PLATFORM.moduleName("./components/indicators/busy-indicator/busy-indicator"),
        PLATFORM.moduleName("./components/indicators/empty-indicator/empty-indicator"),
        PLATFORM.moduleName("./components/layouts/grid-layout/grid-layout"),
        PLATFORM.moduleName("./components/layouts/list-layout/list-layout"),
        PLATFORM.moduleName("./components/modals/modal-backdrop/modal-backdrop"),
        PLATFORM.moduleName("./components/modals/modal-dialog/modal-dialog"),
        PLATFORM.moduleName("./components/modals/modal-href/modal-href"),
        PLATFORM.moduleName("./components/modals/modal-overlay/modal-overlay"),
        PLATFORM.moduleName("./components/modals/modal-panel/modal-panel"),
        PLATFORM.moduleName("./components/modals/modal-section/modal-section"),
        PLATFORM.moduleName("./components/modals/modal-view/modal-view"),
        PLATFORM.moduleName("./components/overlays/busy-overlay/busy-overlay"),
        PLATFORM.moduleName("./components/page/page/page"),
        PLATFORM.moduleName("./components/page/page-content/page-content"),
        PLATFORM.moduleName("./components/page/page-href/page-href"),
        PLATFORM.moduleName("./components/page/page-sidebar/page-sidebar"),
        PLATFORM.moduleName("./components/validation/validation"),
        PLATFORM.moduleName("./components/validation/validators/async-validator/async-validator"),
        PLATFORM.moduleName("./components/validation/validators/custom-validator/custom-validator"),
        PLATFORM.moduleName("./components/validation/validators/dependent-validator/dependent-validator"),
        PLATFORM.moduleName("./components/validation/validators/invalid-validator/invalid-validator"),
        PLATFORM.moduleName("./components/validation/validators/length-validator/length-validator"),
        PLATFORM.moduleName("./components/validation/validators/input-validator/input-validator"),
        PLATFORM.moduleName("./components/validation/validators/pattern-validator/pattern-validator"),
        PLATFORM.moduleName("./components/validation/validators/range-validator/range-validator"),
        PLATFORM.moduleName("./components/validation/validators/required-validator/required-validator"),

        // Converters
        PLATFORM.moduleName("./converters/filter/filter"),
        PLATFORM.moduleName("./converters/map/map"),
        PLATFORM.moduleName("./converters/reverse/reverse"),
        PLATFORM.moduleName("./converters/skip/skip"),
        PLATFORM.moduleName("./converters/take/take"),
        PLATFORM.moduleName("./converters/trim/trim")
    ]);

    // Instantiate the focus service, as it needs to track keyboard and mouse events.
    use.container.get(FocusService);
}

// Components
export * from "./components/behaviors/autofocus/autofocus";
export * from "./components/behaviors/empty/empty";
export * from "./components/behaviors/scroll/scroll";
export * from "./components/behaviors/trap-focus/trap-focus";
export * from "./components/cards/card/card";
export * from "./components/cards/card-skeleton/card-skeleton";
export * from "./components/icons/badge/badge";
export * from "./components/icons/icon/icon";
export * from "./components/icons/md-icon/md-icon";
export * from "./components/icons/md-icon/md-icon-stack";
export * from "./components/controls/inputs/email-input/email-input";
export * from "./components/controls/inputs/number-input/number-input";
export * from "./components/controls/inputs/search-input/search-input";
export * from "./components/controls/inputs/slug-input/slug-input";
export * from "./components/controls/inputs/text-input/text-input";
export * from "./components/controls/inputs/url-input/url-input";
export * from "./components/controls/navigation/path-nav/path-nav";
export * from "./components/controls/navigation/tab-nav/tab-nav";
export * from "./components/controls/navigation/tab-nav/tab";
export * from "./components/controls/navigation/tree-nav/tree-nav";
export * from "./components/controls/toolbar/toolbar";
export * from "./components/controls/toolbar/toolbar-group";
export * from "./components/data-table/data-table";
export * from "./components/data-table/data-table-cell";
export * from "./components/data-table/data-table-headers";
export * from "./components/data-table/data-table-pager";
export * from "./components/data-table/data-table-row";
export * from "./components/data-table/data-table-details";
export * from "./components/file-dropzone/file-dropzone";
export * from "./components/filter/filter";
export * from "./components/indicators/busy-indicator/busy-indicator";
export * from "./components/indicators/empty-indicator/empty-indicator";
export * from "./components/layouts/grid-layout/grid-layout";
export * from "./components/layouts/list-layout/list-layout";
export * from "./components/modals/modal-backdrop/modal-backdrop";
export * from "./components/modals/modal-dialog/modal-dialog";
export * from "./components/modals/modal-href/modal-href";
export * from "./components/modals/modal-overlay/modal-overlay";
export * from "./components/modals/modal-panel/modal-panel";
export * from "./components/modals/modal-section/modal-section";
export * from "./components/modals/modal-view/modal-view";
export * from "./components/overlays/busy-overlay/busy-overlay";
export * from "./components/page/page/page";
export * from "./components/page/page-content/page-content";
export * from "./components/page/page-href/page-href";
export * from "./components/page/page-sidebar/page-sidebar";
export * from "./components/validation/validation";
export * from "./components/validation/validators/async-validator/async-validator";
export * from "./components/validation/validators/custom-validator/custom-validator";
export * from "./components/validation/validators/dependent-validator/dependent-validator";
export * from "./components/validation/validators/invalid-validator/invalid-validator";
export * from "./components/validation/validators/length-validator/length-validator";
export * from "./components/validation/validators/input-validator/input-validator";
export * from "./components/validation/validators/pattern-validator/pattern-validator";
export * from "./components/validation/validators/range-validator/range-validator";
export * from "./components/validation/validators/required-validator/required-validator";

// Converters
export * from "./converters/filter/filter";
export * from "./converters/map/map";
export * from "./converters/reverse/reverse";
export * from "./converters/skip/skip";
export * from "./converters/take/take";
export * from "./converters/trim/trim";

// Services
export * from "./services/focus";
export * from "./services/modal";
export * from "./services/theme";
