import { autoinject } from "aurelia-framework";
import { Type } from "shared/types";
import { Modal } from "./modal";

/**
 * Represents the type of the object passed to the `activate` life cycle method of a component.
 */
type Model<TModal> = TModal extends { activate(modal: Modal<infer T>): any } ? T : never;

/**
 * Represents the type of the object returned by the `deactivate` life cycle method of a component.
 */
type Result<TModal> = TModal extends { deactivate(): infer T } ? T : TModal extends never ? any : void;

/**
 * Represents the registration to which a modal name maps.
 */
interface IModalRegistration
{
    /**
     * The type of the component to present, or its module ID.
     */
    viewModel: string | Type;

    /**
     * The default model to pass to the `activate` life cycle method of the component
     * if no model is specified when the modal is opened.
     */
    model?: any;
}

/**
 * Represents a service that manages the modals on the stack.
 * Inject this where needed, and use it to open and close modals.
 */
@autoinject
export class ModalService
{
    private readonly _registrations = new Map<string, IModalRegistration>();

    /**
     * The stack of modals currently being presented,
     * in the order they were openend.
     */
    public readonly modals: Modal[] = [];

    /**
     * Registers the component with the specified module ID, as a modal with the specified name.
     * @param name The name under which the modal should be registered.
     * @param viewModel The type of the component to present, or its module ID.
     * @param model The default model to use, if not specified when the modal is opened.
     */
    public register(name: string, viewModel: string | Type, model?: any): void
    {
        this._registrations.set(name, { viewModel, model });
    }

    /**
     * Unregisters the modal with the specified name.
     * @param name The name of the modal to unregister.
     */
    public unregister(name: string): void
    {
        this._registrations.delete(name);
    }

    /**
     * Opens a modal of the specified type.
     * @param viewModel The type of the modal.
     * @returns A promise that will be resolved when the modal is closed.
     */
    public open<TModal = any>(viewModel: Type<TModal>): Modal<undefined, Result<TModal>>;

    /**
     * Opens a modal of the specified type.
     * @param viewModel The type of the modal.
     * @param model The model to pass to the `activate` life cycle method of the component.
     * @returns A promise that will be resolved when the modal is closed.
     */
    public open<TModal = any>(viewModel: Type<TModal>, model: Model<TModal>): Modal<Model<TModal>, Result<TModal>>;

    /**
     * Opens the modal with the specified name.
     * @param name The name under which the modal was registered.
     * @param model The model to pass to the `activate` life cycle method of the component.
     * @returns A promise that will be resolved when the modal is closed.
     */
    public open<TModel = any, TResult = any>(name: string, model?: TModel): Modal<TModel, TResult>;

    public open(nameOrType: string | Type, model?: any): Modal
    {
        console.info("Attempting to open modal.", { nameOrType, model });

        let registration: IModalRegistration | undefined;

        if (typeof nameOrType === "string")
        {
            registration = this._registrations.get(nameOrType);

            if (registration == null)
            {
                throw new Error(`No modal has been registered with the name '${nameOrType}'.`);
            }
        }
        else
        {
            registration = { viewModel: nameOrType };
        }

        const modal = new Modal(this.modals, registration.viewModel, model !== undefined ? model : registration.model);

        this.modals.push(modal);

        return modal;
    }

    /**
     * Attempts to close all open modals.
     * @param reason The reason for closing the modals, which may affect how the modals responds.
     * @returns A promise that will be resolved with true if all modals accepted the close request,
     * or false if one of them rejected it with a reason other than an `Error` instance.
     */
    public async closeAll(reason?: any): Promise<boolean>
    {
        console.info("Attempting to close all modals.", { modals: this.modals, reason });

        for (const modal of this.modals.slice().reverse())
        {
            const closed = await modal.close(reason);

            if (!closed)
            {
                return false;
            }
        }

        return true;
    }

    /**
     * Finds all open modals of the specified type.
     * @param viewModel The type of the modal.
     * @returns The open modals with the specified name, if any.
     */
    public find<TModal = any>(viewModel: Type<TModal>): Modal[];

    /**
     * Finds all open modals with the specified name.
     * @param name The name under which the modal was registered.
     * @returns The open modals with the specified name, if any.
     */
    public find<TModel = any, TResult = any>(name: string): Modal[];

    public find(nameOrType: string | Type): Modal[]
    {
        let registration: IModalRegistration | undefined;

        if (typeof nameOrType === "string")
        {
            registration = this._registrations.get(nameOrType);

            if (registration == null)
            {
                throw new Error(`No modal has been registered with the name '${nameOrType}'.`);
            }
        }
        else
        {
            registration = { viewModel: nameOrType };
        }

        return this.modals.filter(m => m.viewModel === registration!.viewModel);
    }
}
