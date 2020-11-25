import { autoinject } from "aurelia-framework";
import { Type } from "shared/types";
import { Toast } from "./toast";
import { ToastCloseReason } from "./toast-close-reason";

/**
 * Represents the type of the object passed to the `activate` life cycle method of a component.
 */
type Model<TToast> = TToast extends { activate(toast: infer TModel): any } ? TModel : never;

/**
 * Represents the type of the object returned by the `deactivate` life cycle method of a component.
 */
// tslint:disable-next-line: invalid-void
type Result<TToast> = TToast extends { deactivate(): infer TResult } ? TResult : TToast extends never ? any : void;

/**
 * Represents the registration to which a toast name maps.
 */
interface IToastRegistration
{
    /**
     * The type of the component to present, or its module ID.
     */
    viewModel: string | Type;

    /**
     * The default model to pass to the `activate` life cycle method of the component
     * if no model is specified when the toast is opened.
     */
    model?: any;
}

/**
 * Represents a service that manages the toasts on the stack.
 * Inject this where needed, and use it to open and close toasts.
 */
@autoinject
export class ToastService
{
    private readonly _registrations = new Map<string, IToastRegistration>();

    /**
     * The stack of toasts currently being presented,
     * with the most recently opened toast at the top.
     */
    public readonly toasts: Toast[] = [];

    /**
     * Registers the component with the specified module ID, as a toast with the specified name.
     * @param name The name under which the toast should be registered.
     * @param viewModel The type of the component to present, or its module ID.
     * @param model The default model to use, if not specified when the toast is opened.
     */
    public register(name: string, viewModel: string | Type, model?: any): void
    {
        this._registrations.set(name, { viewModel, model });
    }

    /**
     * Unregisters the toast with the specified name.
     * @param name The name of the toast to unregister.
     */
    public unregister(name: string): void
    {
        this._registrations.delete(name);
    }

    /**
     * Opens a toast of the specified type.
     * @param viewModel The type of the toast.
     * @param model The model to pass to the `activate` life cycle method of the component.
     * @returns A promise that will be resolved when the toast is closed.
     */
    public open<TToast = any>(viewModel: Type<TToast>, model?: Model<TToast>): Toast<Model<TToast>, Result<TToast>>;

    /**
     * Opens the toast with the specified name.
     * @param name The name under which the toast was registered.
     * @param model The model to pass to the `activate` life cycle method of the component.
     * @returns A promise that will be resolved when the toast is closed.
     */
    public open<TModel = any, TResult = any>(name: string, model?: TModel): Toast<TModel, TResult>;

    public open(nameOrType: string | Type, model?: any): Toast
    {
        console.info("Attempting to open toast", { nameOrType, model });

        let registration: IToastRegistration | undefined;

        if (typeof nameOrType === "string")
        {
            registration = this._registrations.get(nameOrType);

            if (registration == null)
            {
                throw new Error(`No toast has been registered with the name '${nameOrType}'.`);
            }
        }
        else
        {
            registration = { viewModel: nameOrType };
        }

        const toast = new Toast(this.toasts, registration.viewModel, model !== undefined ? model : registration.model);

        this.toasts.unshift(toast);

        return toast;
    }

    /**
     * Attempts to close all open toasts.
     * @param reason The reason for closing the toasts, which may affect how the toasts responds.
     * @returns A promise that will be resolved with true if all toasts accepted the close request,
     * or false if one of them rejected it with a reason other than an `Error` instance.
     */
    public async closeAll(reason: ToastCloseReason): Promise<boolean>
    {
        if (this.toasts.length === 0)
        {
            return true;
        }

        console.info("Attempting to close all toasts", { toasts: this.toasts, reason });

        const promises: Promise<boolean>[] = [];

        for (const toast of this.toasts.slice().reverse())
        {
            promises.push(toast.close(reason));
        }

        return Promise.all(promises).then(results => results.every(r => r));
    }

    /**
     * Finds all open toasts of the specified type.
     * @param viewModel The type of the toast.
     * @returns The open toasts with the specified name, if any.
     */
    public find<TToast = any>(viewModel: Type<TToast>): Toast[];

    /**
     * Finds all open toasts with the specified name.
     * @param name The name under which the toast was registered.
     * @returns The open toasts with the specified name, if any.
     */
    public find<TModel = any, TResult = any>(name: string): Toast[];

    public find(nameOrType: string | Type): Toast[]
    {
        let registration: IToastRegistration | undefined;

        if (typeof nameOrType === "string")
        {
            registration = this._registrations.get(nameOrType);

            if (registration == null)
            {
                throw new Error(`No toast has been registered with the name '${nameOrType}'.`);
            }
        }
        else
        {
            registration = { viewModel: nameOrType };
        }

        return this.toasts.filter(m => m.viewModel === registration!.viewModel);
    }
}
