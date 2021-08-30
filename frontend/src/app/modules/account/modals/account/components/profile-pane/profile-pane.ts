import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ModalService } from "shared/framework";
import { Profile } from "app/services/profile";

/**
 * Represents a tab pane for managing the profile for the current user.
 */
@autoinject
export class ProfilePaneCustomElement
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
     * The model representing the profile for the current user.
     */
    @bindable
    public model: Partial<Profile>;

    /**
     * The strings from which initials should be generated.
     */
    @computedFrom("model.preferredName")
    protected get initials(): (string | undefined)[]
    {
        return [this.model.preferredName];
    }

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
