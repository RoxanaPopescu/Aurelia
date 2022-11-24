// This file imports the styles for each icon library, associates icon names with file paths,
// and establishes those as dependencies, loaded by the Webpack plugin `svg-sprite-loader`.
// See: https://github.com/JetBrains/svg-sprite-loader

// Import the styles for each icon library.
import "./material/styles.scss";
import "./atlassian/styles.scss";
import "./lingu/styles.scss";
import "./mover/styles.scss";

// Associate icon names with file paths.
const icons =
{
    // Library: Material

    "arrow-backward-ios": "material/outline/arrow-backward-ios",
    "arrow-forward-ios": "material/outline/arrow-forward-ios",
    "arrow-upward": "material/outline/arrow-upward",
    "check-mark": "material/outline/check-mark",
    "check-toggle-checked": "material/filled/check-toggle-checked",
    "check-toggle-indeterminate": "material/filled/custom/check-toggle-indeterminate",
    "check-toggle-unchecked": "material/filled/check-toggle-unchecked",
    "chevron-left": "material/outline/chevron-left",
    "chevron-right": "material/outline/chevron-right",
    "clear": "material/outline/clear",
    "clear-all": "material/outline/clear-all",
    "copy": "material/outline/copy",
    "delete": "material/filled/delete",
    "domain": "material/outline/domain",
    "edit": "material/filled/edit",
    "error-outline": "material/outline/error-outline",
    "expand-less": "material/outline/expand-less",
    "expand-more": "material/outline/expand-more",
    "file": "material/filled/custom/file",
    "filter": "material/filled/filter",
    "folder": "material/filled/folder",
    "folder-outline": "material/outline/folder-outline",
    "hub": "material/outline/hub",
    "info-outline": "material/outline/info-outline",
    "lock-open": "material/outline/lock-open",
    "new-folder": "material/outline/create-new-folder",
    "open-in-new": "material/outline/open-in-new",
    "person": "material/filled/person",
    "radio-toggle-checked": "material/outline/radio-toggle-checked",
    "radio-toggle-unchecked": "material/outline/radio-toggle-unchecked",
    "remove": "material/outline/remove",
    "replay": "material/outline/replay",
    "restart": "material/outline/restart",
    "rules": "material/outline/rules",
    "sort-ascending": "material/outline/sort-ascending",
    "sort-descending": "material/outline/sort-descending",
    "style": "material/outline/style",
    "switch-toggle-checked": "material/filled/switch-toggle-checked",
    "switch-toggle-indeterminate": "material/filled/custom/switch-toggle-indeterminate",
    "switch-toggle-unchecked": "material/filled/switch-toggle-unchecked",
    "undo": "material/outline/undo",
    "visibility-disabled": "material/filled/visibility-disabled",
    "visibility-enabled": "material/filled/visibility-enabled",

    // Library: Atlassian

    "add": "atlassian/outline/add",
    "back": "atlassian/outline/back",
    "close": "atlassian/outline/close",
    "help": "atlassian/filled/help",
    "more": "atlassian/outline/more",
    "notifications": "atlassian/filled/notifications",
    "search": "atlassian/outline/search",
    "starred": "atlassian/outline/starred",

    // Library: Lingu

    "dark-mode-toggle-checked": "lingu/filled/dark-mode-toggle-checked",
    "dark-mode-toggle-indeterminate": "lingu/filled/dark-mode-toggle-indeterminate",
    "dark-mode-toggle-unchecked": "lingu/filled/dark-mode-toggle-unchecked",

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
    "info-outline-small": "mover/outline/info-outline-small",
    "kpi": "mover/outline/kpi",
    "map-pin": "mover/other/map-pin",
    "minus-small": "mover/outline/minus-small",
    "order-groups": "mover/outline/order-groups",
    "orders": "mover/outline/orders",
    "pause": "mover/outline/pause",
    "picture-small": "mover/filled/picture-small",
    "play": "mover/outline/play",
    "plus-small": "mover/outline/plus-small",
    "route-planning": "mover/outline/route-planning",
    "route-tracking": "mover/outline/route-tracking",
    "routes": "mover/outline/routes",
    "save": "mover/outline/save",
    "settings": "mover/outline/settings",
    "sidebar-collapse": "mover/outline/sidebar-collapse",
    "sidebar-expand": "mover/outline/sidebar-expand",
    "star": "mover/filled/star",
    "templates": "mover/outline/templates",
    "users": "mover/outline/users",
    "vehicles": "mover/outline/vehicles",
    "warning": "mover/filled/warning",
};

// Require the icon files.
Object.values(icons).forEach(filePath => require(`./${filePath}.svg`));

/**
 * The associations between icon names and file paths, from which icon IDs can be inferred.
 * This enables us to use semantic and consistent icon names, and to easily replace icons.
 */
export default icons;
