import { autoinject, bindable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";

export interface ISignOutModel
{
    /**
     * The slug identifying the current view presented by the component.
     */
    view: "sign-out";

    /**
     * The function to call when the operation completes.
     */
    onSignedOut?: () => unknown | Promise<unknown>;

    /**
     * True if the operation is pending, otherwise false.
     */
    busy?: boolean;

    /**
     * True if the operation was completed, otherwise false.
     */
    done?: boolean;

    /**
     * The error that occurred while executing the operation, if any.
     */
    error?: Error;
}

@autoinject
export class SignOutCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this._identityService = identityService;
    }

    private readonly _identityService: IdentityService;

    /**
     * The model representing the state of the component.
     */
    @bindable
    protected model: ISignOutModel;

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
        try
        {
            this.model.busy = true;

            await this._identityService.unauthenticate();

            // tslint:disable-next-line: await-promise
            await this.model.onSignedOut?.();

            this.model.error = undefined;
            this.model.done = true;
        }
        catch (error)
        {
            this.model.error = error;

            Log.error("Sign out failed.", error);
        }
        finally
        {
            this.model.busy = false;
        }
    }
}
