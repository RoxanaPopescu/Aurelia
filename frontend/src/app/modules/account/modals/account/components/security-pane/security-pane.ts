import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { AsyncCallback } from "shared/types";
import { ModalService } from "shared/framework";
import { Profile } from "app/services/profile";

/**
 * Represents a tab pane for managing security for the current user.
 */
@autoinject
export class SecurityPaneCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        this._modalService = modalService;
    }

    private readonly _modalService: ModalService;

    /**
     * True if the new password input has not been unlocked, otherwise false.
     */
    protected newPasswordLocked: boolean;

    /**
     * The new password, if specified.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public newPassword: string | undefined;

    /**
     * The model representing the profile for the current user.
     */
    @bindable
    public model: Partial<Profile>;

    /**
     * The function to call when the `Delete account` button is pressed.
     */
    @bindable
    public deleteClick: AsyncCallback;

    /**
     * Called when the unlock icon is clicked in an input.
     * @returns A promise that will be resolved with true if the the input should unlock, otherwise false.
     */
    protected async onInputUnlock(): Promise<boolean>
    {
        if (this.model.currentPassword == null)
        {
            this.model.currentPassword = await this._modalService.open("verify-password").promise;
        }

        return this.model.currentPassword != null;
    }
}
