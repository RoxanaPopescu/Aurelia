import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { AccountService } from "app/modules/account/services/account";

export interface IConfirmEmailModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "confirm-email";

    /**
     * The token specified in the confirmation link sent to the user.
     */
    token?: string;

    /**
     * The function to call when the operation completes.
     */
    onConfirmedEmail?: () => unknown | Promise<unknown>;

    /**
     * True if the operation is pending, otherwise false.
     */
    busy?: boolean;

    /**
     * True if the operation was completed, otherwise false.
     */
    done?: boolean;
}

@autoinject
export class ConfirmEmailCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param accountService The `AccountService` instance.
     */
    public constructor(accountService: AccountService)
    {
        this._accountService = accountService;
    }

    private readonly _accountService: AccountService;

    /**
     * The model representing the state of the component.
     */
    @bindable
    protected model: IConfirmEmailModel;

    /**
     * Called by the framework when the component is binding.
     * Resets the `done` state of the component.
     */
    public bind(): void
    {
        this.model.busy = false;
        this.model.done = false;
    }

    /**
     * Called by the framework when the component is attached.
     */
    public async attached(): Promise<void>
    {
        if (!this.model.token)
        {
            Log.error("No token specified.");

            return;
        }

        try
        {
            this.model.busy = true;

            await this._accountService.confirmEmail(this.model.token);

            // tslint:disable-next-line: await-promise
            await this.model.onConfirmedEmail?.();

            this.model.done = true;
        }
        catch (error)
        {
            Log.error("Failed to confirm the account.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
