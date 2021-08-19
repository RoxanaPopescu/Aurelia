import { autoinject, bindable } from "aurelia-framework";
import { AsyncCallback } from "shared/types";

/**
 * Represents a tab pane for managing the account for the current user.
 */
@autoinject
export class AccountPaneCustomElement
{
    /**
     * The function to call when the `Delete account` button is pressed.
     */
    @bindable
    public deleteClick: AsyncCallback;
}
