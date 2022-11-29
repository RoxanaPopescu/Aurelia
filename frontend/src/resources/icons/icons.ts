// This file imports the styles for each icon library, associates icon names with file paths,
// and establishes those as dependencies, loaded by the Webpack plugin `svg-sprite-loader`.
// See: https://github.com/JetBrains/svg-sprite-loader

// Import the styles for each icon library.
import "./atlassian/styles.scss";
import "./lingu/styles.scss";
import "./material/styles.scss";
import "./mover/styles.scss";
import "./octicons/styles.scss";

// Associate icon names with file paths.
const icons =
{
    // Library: Material

    "check-mark": "material/outline/check",
    "check-toggle-checked": "material/filled/check-box",
    "check-toggle-indeterminate": "material/filled/custom/check-box-indeterminate",
    "check-toggle-unchecked": "material/filled/check-box-outline-blank",
    "chevron-left": "material/outline/chevron-left",
    "chevron-right": "material/outline/chevron-right",
    "clear": "material/outline/clear",
    "create-folder": "material/outline/create-new-folder",
    "delete": "material/outline/delete",
    "done-all": "material/outline/done-all",
    "done": "material/outline/done",
    "organization": "material/outline/domain",
    "edit": "material/outline/edit",
    "error-circle": "material/outline/error-outline",
    "expand-less": "material/outline/expand-less",
    "expand-more": "material/outline/expand-more",
    "file-filled": "material/filled/custom/file",
    "file-outline": "material/filled/custom/file",
    "filter": "material/filled/filter-alt",
    "folder-filled": "material/filled/folder",
    "folder-outline": "material/outline/folder",
    "hub": "material/outline/hub",
    "info-circle": "material/outline/info",
    "lock-open": "material/outline/lock-open",
    "navigate-backward": "material/outline/arrow-back-ios-new",
    "navigate-forward": "material/outline/arrow-forward-ios",
    "open-in-new": "material/outline/open-in-new",
    "radio-toggle-checked": "material/outline/radio-button-checked",
    "radio-toggle-unchecked": "material/outline/radio-button-unchecked",
    "redo": "material/outline/redo",
    "remove": "material/outline/remove",
    "replay": "material/outline/replay",
    "restart": "material/outline/restart-alt",
    "rules": "material/outline/rule",
    "sort-ascending": "material/outline/custom/sort-reverse",
    "sort-descending": "material/outline/sort",
    "style": "material/outline/style",
    "switch-toggle-checked": "material/filled/toggle-on",
    "switch-toggle-indeterminate": "material/filled/custom/toggle-indeterminate",
    "switch-toggle-unchecked": "material/filled/toggle-off",
    "undo": "material/outline/undo",
    "visibility-disabled": "material/filled/visibility-off",
    "visibility-enabled": "material/filled/visibility",

    // Library: Atlassian

    "add": "atlassian/outline/add",
    "arrow-backward": "atlassian/outline/arrow-left",
    "arrow-downward": "atlassian/outline/arrow-down",
    "arrow-forward": "atlassian/outline/arrow-right",
    "arrow-upward": "atlassian/outline/arrow-up",
    "close": "atlassian/outline/cross",
    "copy": "atlassian/outline/copy",
    "more": "atlassian/outline/more",
    "search": "atlassian/outline/search",
    "star-filled": "atlassian/filled/custom/star-large",
    "star-outline": "atlassian/outline/star-large",

    // Library: Lingu

    "dark-mode-toggle-checked": "lingu/filled/dark-mode-toggle-checked",
    "dark-mode-toggle-indeterminate": "lingu/filled/dark-mode-toggle-indeterminate",
    "dark-mode-toggle-unchecked": "lingu/filled/dark-mode-toggle-unchecked",
    "missing": "lingu/outline/missing",

    // Library: Mover

    "auto-dispatch": "mover/outline/auto-dispatch",
    "communication": "mover/outline/communication",
    "delete-small": "mover/filled/delete-small",
    "departments": "mover/outline/departments",
    "depots": "mover/outline/depots",
    "dispatch": "mover/outline/dispatch",
    "document": "mover/outline/document",
    "drag-handle": "mover/outline/drag-handle",
    "edit-small": "mover/filled/edit-small",
    "empty-box": "mover/other/empty-box",
    "empty-map-drawing": "mover/other/empty-map-drawing",
    "express-dispatch": "mover/outline/express-dispatch",
    "eye": "mover/outline/eye",
    "fleet": "mover/outline/fleet",
    "import": "mover/outline/import",
    "info-circle-small": "mover/outline/info-circle-small",
    "kpi": "mover/outline/kpi",
    "map-pin": "mover/other/map-pin",
    "minus-small": "mover/outline/minus-small",
    "order-groups": "mover/outline/order-groups",
    "orders": "mover/outline/orders",
    "pause": "mover/outline/pause",
    "people": "mover/outline/people",
    "person": "mover/outline/person",
    "picture-small": "mover/filled/picture-small",
    "play": "mover/outline/play",
    "plus-small": "mover/outline/plus-small",
    "route-planning": "mover/outline/route-planning",
    "route-tracking": "mover/outline/route-tracking",
    "routes": "mover/outline/routes",
    "save": "mover/outline/save",
    "gear": "mover/outline/gear",
    "sidebar-collapse": "mover/outline/sidebar-collapse",
    "sidebar-expand": "mover/outline/sidebar-expand",
    "star": "mover/filled/star",
    "templates": "mover/outline/templates",
    "vehicles": "mover/outline/vehicles",
    "warning": "mover/filled/warning",

    // Library: Octicons

    "question": "octicons/outline/question-24",
    "bell": "octicons/outline/bell-24",
    "gear-small": "octicons/outline/gear-16"
};

// Require the icon files.
Object.values(icons).forEach(filePath => require(`./${filePath}.svg`));

/**
 * The associations between icon names and file paths, from which icon IDs can be inferred.
 * This enables us to use semantic and consistent icon names, and to easily replace icons.
 */
export default icons;
