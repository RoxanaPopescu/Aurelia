import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { AccountService } from "app/modules/account/services/account";
import { IdentityService } from "app/services/identity";

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
     * @param identityService The `IdentityService` instance.
     */
    public constructor(accountService: AccountService, identityService: IdentityService)
    {
        this._accountService = accountService;
        this._identityService = identityService;
    }

    private readonly _accountService: AccountService;
    private readonly _identityService: IdentityService;

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
     * Called when the component is attached.
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

            const tokens = await this._accountService.confirmEmail(this.model.token);

            try
            {
                await this._identityService.authenticated({ ...tokens });
            }
            catch (error)
            {
                Log.error("Sign in failed.", error);

                return;
            }

            // tslint:disable-next-line: await-promise
            await this.model.onConfirmedEmail?.();

            this.model.done = true;
        }
        catch (error)
        {
            Log.error("Could not confirm the account.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
