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
        PLATFORM.moduleName("./components/behaviors/scroll/scroll"),
        PLATFORM.moduleName("./components/behaviors/trap-focus/trap-focus"),
        PLATFORM.moduleName("./components/busy-overlay/busy-overlay"),
        PLATFORM.moduleName("./components/cards/card/card"),
        PLATFORM.moduleName("./components/cards/card-skeleton/card-skeleton"),
        PLATFORM.moduleName("./components/controls/icons/badge/badge"),
        PLATFORM.moduleName("./components/controls/icons/icon/icon"),
        PLATFORM.moduleName("./components/controls/icons/md-icon/md-icon"),
        PLATFORM.moduleName("./components/controls/icons/md-icon/md-icon-stack"),
        PLATFORM.moduleName("./components/controls/navigation/path-nav/path-nav"),
        PLATFORM.moduleName("./components/controls/navigation/tab-nav/tab-nav"),
        PLATFORM.moduleName("./components/controls/navigation/tab-nav/tab"),
        PLATFORM.moduleName("./components/controls/navigation/tree-nav/tree-nav"),
        PLATFORM.moduleName("./components/data-table/data-table"),
        PLATFORM.moduleName("./components/data-table/data-table-headers"),
        PLATFORM.moduleName("./components/data-table/data-table-row"),
        PLATFORM.moduleName("./components/data-table/data-table-details"),
        PLATFORM.moduleName("./components/file-dropzone/file-dropzone"),
        PLATFORM.moduleName("./components/layouts/grid-layout/grid-layout"),
        PLATFORM.moduleName("./components/layouts/list-layout/list-layout"),
        PLATFORM.moduleName("./components/modals/modal-backdrop/modal-backdrop"),
        PLATFORM.moduleName("./components/modals/modal-dialog/modal-dialog"),
        PLATFORM.moduleName("./components/modals/modal-href/modal-href"),
        PLATFORM.moduleName("./components/modals/modal-overlay/modal-overlay"),
        PLATFORM.moduleName("./components/modals/modal-panel/modal-panel"),
        PLATFORM.moduleName("./components/modals/modal-view/modal-view"),
        PLATFORM.moduleName("./components/page/page/page"),
        PLATFORM.moduleName("./components/page/page-content/page-content"),
        PLATFORM.moduleName("./components/page/page-href/page-href"),
        PLATFORM.moduleName("./components/page/page-sidebar/page-sidebar"),
        PLATFORM.moduleName("./components/toolbar/toolbar"),
        PLATFORM.moduleName("./components/toolbar/toolbar-group"),

        // Converters
        PLATFORM.moduleName("./converters/filter/filter"),
        PLATFORM.moduleName("./converters/take/take"),
        PLATFORM.moduleName("./converters/reverse/reverse"),
        PLATFORM.moduleName("./converters/skip/skip")
    ]);

    // Instantiate the focus service, as it needs to track keyboard and mouse events.
    use.container.get(FocusService);
}

// Components
export * from "./components/behaviors/autofocus/autofocus";
export * from "./components/behaviors/scroll/scroll";
export * from "./components/behaviors/trap-focus/trap-focus";
export * from "./components/busy-overlay/busy-overlay";
export * from "./components/cards/card/card";
export * from "./components/cards/card-skeleton/card-skeleton";
export * from "./components/controls/icons/badge/badge";
export * from "./components/controls/icons/icon/icon";
export * from "./components/controls/icons/md-icon/md-icon";
export * from "./components/controls/icons/md-icon/md-icon-stack";
export * from "./components/controls/navigation/path-nav/path-nav";
export * from "./components/controls/navigation/tab-nav/tab-nav";
export * from "./components/controls/navigation/tab-nav/tab";
export * from "./components/controls/navigation/tree-nav/tree-nav";
export * from "./components/data-table/data-table";
export * from "./components/data-table/data-table-headers";
export * from "./components/data-table/data-table-row";
export * from "./components/data-table/data-table-details";
export * from "./components/file-dropzone/file-dropzone";
export * from "./components/filter/filter";
export * from "./components/layouts/grid-layout/grid-layout";
export * from "./components/layouts/list-layout/list-layout";
export * from "./components/modals/modal-backdrop/modal-backdrop";
export * from "./components/modals/modal-dialog/modal-dialog";
export * from "./components/modals/modal-href/modal-href";
export * from "./components/modals/modal-overlay/modal-overlay";
export * from "./components/modals/modal-panel/modal-panel";
export * from "./components/modals/modal-view/modal-view";
export * from "./components/page/page/page";
export * from "./components/page/page-content/page-content";
export * from "./components/page/page-href/page-href";
export * from "./components/page/page-sidebar/page-sidebar";
export * from "./components/toolbar/toolbar";
export * from "./components/toolbar/toolbar-group";

// Converters
export * from "./converters/filter/filter";
export * from "./converters/take/take";
export * from "./converters/reverse/reverse";
export * from "./converters/skip/skip";

// Services
export * from "./services/focus";
export * from "./services/modal";
export * from "./services/theme";
