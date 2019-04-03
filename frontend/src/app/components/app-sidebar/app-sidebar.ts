import { bindable } from "aurelia-framework";

/**
 * Represents the sidebar of the app, which acts as the global navigation hub for authenticated users.
 * This provides access to the `dashboard` overlay, `search` panel, `pinned` panel, `notifications` panel,
 * `profile` module, help and support, as well as any modals specific to the current view.
 *
 * ### How to use:
 * Place this directly within the root `router-view` element.
 * Note that a few modules, such as `account/sign-in` and `account/sign-up`, do not use this component,
 * as it's only relevant for authenticated users.
 */
export class AppSidebarCustomElement
{
    /**
     * True to reduce the visibility of the shadow, otherwise false.
     * This should only be true when presented together with a modal overlay with the same surface color.
     */
    @bindable({ defaultValue: false })
    public reduceShadow: boolean;

    /**
     * True to disable toggling of the dashboard, otherwise false.
     * This should only be false when presented as the landing page after sign in.
     */
    @bindable({ defaultValue: false })
    public disableDashboard: boolean;
}
