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
        PLATFORM.moduleName("./components/behaviors/empty-value/empty-value"),
        PLATFORM.moduleName("./components/behaviors/forward-focus/forward-focus"),
        PLATFORM.moduleName("./components/behaviors/intersection/intersection"),
        PLATFORM.moduleName("./components/behaviors/scroll/scroll"),
        PLATFORM.moduleName("./components/behaviors/scroll-sentinel/scroll-sentinel"),
        PLATFORM.moduleName("./components/behaviors/surface/surface"),
        PLATFORM.moduleName("./components/behaviors/trap-focus/trap-focus"),
        PLATFORM.moduleName("./components/cards/card/card"),
        PLATFORM.moduleName("./components/cards/card-skeleton/card-skeleton"),
        PLATFORM.moduleName("./components/controls/buttons/dropdown-button/dropdown-button"),
        PLATFORM.moduleName("./components/controls/buttons/select-button/select-button"),
        PLATFORM.moduleName("./components/controls/dropdown/dropdown"),
        PLATFORM.moduleName("./components/controls/dropdown/dropdown-icon"),
        PLATFORM.moduleName("./components/controls/inputs/color-input/color-input"),
        PLATFORM.moduleName("./components/controls/inputs/date-input/date-input"),
        PLATFORM.moduleName("./components/controls/inputs/date-time-input/date-time-input"),
        PLATFORM.moduleName("./components/controls/inputs/email-input/email-input"),
        PLATFORM.moduleName("./components/controls/inputs/input-lock/input-lock"),
        PLATFORM.moduleName("./components/controls/inputs/number-input/number-input"),
        PLATFORM.moduleName("./components/controls/inputs/password-input/password-input"),
        PLATFORM.moduleName("./components/controls/inputs/password-input/password-input-placeholder"),
        PLATFORM.moduleName("./components/controls/inputs/phone-input/phone-input"),
        PLATFORM.moduleName("./components/controls/inputs/search-input/search-input"),
        PLATFORM.moduleName("./components/controls/inputs/select-input/select-input"),
        PLATFORM.moduleName("./components/controls/inputs/slug-input/slug-input"),
        PLATFORM.moduleName("./components/controls/inputs/tags-input/tags-input"),
        PLATFORM.moduleName("./components/controls/inputs/tags-input/tag"),
        PLATFORM.moduleName("./components/controls/inputs/text-input/text-input"),
        PLATFORM.moduleName("./components/controls/inputs/time-input/time-input"),
        PLATFORM.moduleName("./components/controls/inputs/url-input/url-input"),
        PLATFORM.moduleName("./components/controls/navigation/path-nav/path-nav"),
        PLATFORM.moduleName("./components/controls/navigation/tab-nav/tab-nav"),
        PLATFORM.moduleName("./components/controls/navigation/tab-nav/tab"),
        PLATFORM.moduleName("./components/controls/navigation/tree-nav/tree-nav"),
        PLATFORM.moduleName("./components/controls/pickers/color-picker/color-picker"),
        PLATFORM.moduleName("./components/controls/pickers/date-picker/date-picker"),
        PLATFORM.moduleName("./components/controls/pickers/item-picker/item-picker"),
        PLATFORM.moduleName("./components/controls/pickers/item-picker/item"),
        PLATFORM.moduleName("./components/controls/toggles/toggle-group/toggle-group"),
        PLATFORM.moduleName("./components/controls/toggles/check-toggle/check-toggle"),
        PLATFORM.moduleName("./components/controls/toggles/radio-toggle/radio-toggle"),
        PLATFORM.moduleName("./components/controls/toggles/switch-toggle/switch-toggle"),
        PLATFORM.moduleName("./components/controls/toolbar/toolbar"),
        PLATFORM.moduleName("./components/controls/toolbar/toolbar-group"),
        PLATFORM.moduleName("./components/data-table/data-table"),
        PLATFORM.moduleName("./components/data-table/data-table-cell"),
        PLATFORM.moduleName("./components/data-table/data-table-headers"),
        PLATFORM.moduleName("./components/data-table/data-table-pager"),
        PLATFORM.moduleName("./components/data-table/data-table-row"),
        PLATFORM.moduleName("./components/data-table/data-table-details"),
        PLATFORM.moduleName("./components/file-dropzone/file-dropzone"),
        PLATFORM.moduleName("./components/icons/badge/badge"),
        PLATFORM.moduleName("./components/icons/icon/icon"),
        PLATFORM.moduleName("./components/icons/md-icon/md-icon"),
        PLATFORM.moduleName("./components/icons/md-icon/md-icon-stack"),
        PLATFORM.moduleName("./components/indicators/busy-indicator/busy-indicator"),
        PLATFORM.moduleName("./components/indicators/empty-indicator/empty-indicator"),
        PLATFORM.moduleName("./components/indicators/no-results-indicator/no-results-indicator"),
        PLATFORM.moduleName("./components/layouts/grid-layout/grid-layout"),
        PLATFORM.moduleName("./components/layouts/list-layout/list-layout"),
        PLATFORM.moduleName("./components/modals/modal-backdrop/modal-backdrop"),
        PLATFORM.moduleName("./components/modals/modal-dialog/modal-dialog"),
        PLATFORM.moduleName("./components/modals/modal-footer/modal-footer"),
        PLATFORM.moduleName("./components/modals/modal-header/modal-header"),
        PLATFORM.moduleName("./components/modals/modal-href/modal-href"),
        PLATFORM.moduleName("./components/modals/modal-overlay/modal-overlay"),
        PLATFORM.moduleName("./components/modals/modal-panel/modal-panel"),
        PLATFORM.moduleName("./components/modals/modal-section/modal-section"),
        PLATFORM.moduleName("./components/modals/modal-view/modal-view"),
        PLATFORM.moduleName("./components/overlays/busy-overlay/busy-overlay"),
        PLATFORM.moduleName("./components/page/page/page"),
        PLATFORM.moduleName("./components/page/page-content/page-content"),
        PLATFORM.moduleName("./components/page/page-footer/page-footer"),
        PLATFORM.moduleName("./components/page/page-header/page-header"),
        PLATFORM.moduleName("./components/page/page-href/page-href"),
        PLATFORM.moduleName("./components/page/page-section/page-section"),
        PLATFORM.moduleName("./components/page/page-sidebar/page-sidebar"),
        PLATFORM.moduleName("./components/toasts/toast/toast"),
        PLATFORM.moduleName("./components/toasts/toast-footer/toast-footer"),
        PLATFORM.moduleName("./components/toasts/toast-header/toast-header"),
        PLATFORM.moduleName("./components/toasts/toast-section/toast-section"),
        PLATFORM.moduleName("./components/toasts/toast-view/toast-view"),
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
        PLATFORM.moduleName("./converters/json/json"),
        PLATFORM.moduleName("./converters/map/map"),
        PLATFORM.moduleName("./converters/reverse/reverse"),
        PLATFORM.moduleName("./converters/scale/scale"),
        PLATFORM.moduleName("./converters/skip/skip"),
        PLATFORM.moduleName("./converters/take/take"),
        PLATFORM.moduleName("./converters/time-of-day/time-of-day"),
        PLATFORM.moduleName("./converters/trim/trim")
    ]);

    // Instantiate the focus service, as it needs to track keyboard and mouse events.
    use.container.get(FocusService);
}

// Components
export * from "./components/behaviors/autofocus/autofocus";
export * from "./components/behaviors/empty/empty";
export * from "./components/behaviors/empty-value/empty-value";
export * from "./components/behaviors/forward-focus/forward-focus";
export * from "./components/behaviors/intersection/intersection";
export * from "./components/behaviors/scroll/scroll";
export * from "./components/behaviors/scroll-sentinel/scroll-sentinel";
export * from "./components/behaviors/surface/surface";
export * from "./components/behaviors/trap-focus/trap-focus";
export * from "./components/cards/card/card";
export * from "./components/cards/card-skeleton/card-skeleton";
export * from "./components/controls/buttons/dropdown-button/dropdown-button";
export * from "./components/controls/buttons/select-button/select-button";
export * from "./components/controls/control";
export * from "./components/controls/buttons/select-button/select-button";
export * from "./components/controls/dropdown/dropdown";
export * from "./components/controls/dropdown/dropdown-icon";
export * from "./components/controls/inputs/input";
export * from "./components/controls/inputs/color-input/color-input";
export * from "./components/controls/inputs/date-input/date-input";
export * from "./components/controls/inputs/date-time-input/date-time-input";
export * from "./components/controls/inputs/email-input/email-input";
export * from "./components/controls/inputs/input-lock/input-lock";
export * from "./components/controls/inputs/number-input/number-input";
export * from "./components/controls/inputs/password-input/password-input";
export * from "./components/controls/inputs/password-input/password-input-placeholder";
export * from "./components/controls/inputs/phone-input/phone-input";
export * from "./components/controls/inputs/search-input/search-input";
export * from "./components/controls/inputs/select-input/select-input";
export * from "./components/controls/inputs/slug-input/slug-input";
export * from "./components/controls/inputs/tags-input/tags-input";
export * from "./components/controls/inputs/tags-input/tag";
export * from "./components/controls/inputs/text-input/text-input";
export * from "./components/controls/inputs/time-input/time-input";
export * from "./components/controls/inputs/url-input/url-input";
export * from "./components/controls/navigation/path-nav/path-nav";
export * from "./components/controls/navigation/tab-nav/tab-nav";
export * from "./components/controls/navigation/tab-nav/tab";
export * from "./components/controls/navigation/tree-nav/tree-nav";
export * from "./components/controls/pickers/color-picker/color-picker";
export * from "./components/controls/pickers/date-picker/date-picker";
export * from "./components/controls/pickers/item-picker/item-picker";
export * from "./components/controls/pickers/item-picker/item";
export * from "./components/controls/toggles/toggle";
export * from "./components/controls/toggles/toggle-group/toggle-group";
export * from "./components/controls/toggles/check-toggle/check-toggle";
export * from "./components/controls/toggles/radio-toggle/radio-toggle";
export * from "./components/controls/toggles/switch-toggle/switch-toggle";
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
export * from "./components/icons/badge/badge";
export * from "./components/icons/icon/icon";
export * from "./components/icons/md-icon/md-icon";
export * from "./components/icons/md-icon/md-icon-stack";
export * from "./components/indicators/busy-indicator/busy-indicator";
export * from "./components/indicators/empty-indicator/empty-indicator";
export * from "./components/indicators/no-results-indicator/no-results-indicator";
export * from "./components/layouts/grid-layout/grid-layout";
export * from "./components/layouts/list-layout/list-layout";
export * from "./components/modals/modal-backdrop/modal-backdrop";
export * from "./components/modals/modal-dialog/modal-dialog";
export * from "./components/modals/modal-footer/modal-footer";
export * from "./components/modals/modal-header/modal-header";
export * from "./components/modals/modal-href/modal-href";
export * from "./components/modals/modal-overlay/modal-overlay";
export * from "./components/modals/modal-panel/modal-panel";
export * from "./components/modals/modal-section/modal-section";
export * from "./components/modals/modal-view/modal-view";
export * from "./components/overlays/busy-overlay/busy-overlay";
export * from "./components/page/page/page";
export * from "./components/page/page-content/page-content";
export * from "./components/page/page-footer/page-footer";
export * from "./components/page/page-header/page-header";
export * from "./components/page/page-href/page-href";
export * from "./components/page/page-section/page-section";
export * from "./components/page/page-sidebar/page-sidebar";
export * from "./components/toasts/toast/toast";
export * from "./components/toasts/toast-footer/toast-footer";
export * from "./components/toasts/toast-header/toast-header";
export * from "./components/toasts/toast-section/toast-section";
export * from "./components/toasts/toast-view/toast-view";
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
export * from "./converters/json/json";
export * from "./converters/map/map";
export * from "./converters/reverse/reverse";
export * from "./converters/scale/scale";
export * from "./converters/skip/skip";
export * from "./converters/take/take";
export * from "./converters/time-of-day/time-of-day";
export * from "./converters/trim/trim";

// Services
export * from "./services/focus";
export * from "./services/modal";
export * from "./services/theme";
export * from "./services/toast";
