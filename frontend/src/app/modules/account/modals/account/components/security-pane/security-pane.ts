import { autoinject, bindable } from "aurelia-framework";
import { AsyncCallback } from "shared/types";

/**
 * Represents a tab pane for managing security for the current user.
 */
@autoinject
export class SecurityPaneCustomElement
{
    /**
     * True if the new password input has not been unlocked, otherwise false.
     */
    protected newPasswordLocked: boolean;

    /**
     * The new password, if specified.
     */
    @bindable
    public newPassword: string | undefined;

    /**
     * The function to call when the `Delete account` button is pressed.
     */
    @bindable
    public deleteClick: AsyncCallback;
}
