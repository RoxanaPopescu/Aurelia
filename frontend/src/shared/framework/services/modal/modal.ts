import { Container, BindingEngine } from "aurelia-framework";
import { Compose } from "aurelia-templating-resources";
import { Type } from "shared/types";
import { PromiseController } from "shared/utilities";
import { ModalCloseReason } from "./modal-close-reason";

/**
 * Represents a modal on the stack.
 */
export class Modal<TModel = any, TResult = any>
{
    /**
     * Creates a new instance of the type.
     * @param modals The stack of open modals.
     * @param viewModel The type of the component to present, or its module ID.
     * @param model The model to pass to the `activate` life cycle method of the component.
     */
    public constructor(modals: Modal[], viewModel: string | Type, model?: TModel)
    {
        this._modals = modals;
        this.viewModel = viewModel;
        this.model = model;

        const bindingEngine = Container.instance.get(BindingEngine);
        const handle = bindingEngine.propertyObserver(this, "compose").subscribe((newValue: any) =>
        {
            handle.dispose();

            // tslint:disable-next-line: no-floating-promises
            this.onComposeSet(newValue);
        });
    }

    private readonly _promiseController = new PromiseController<any>();
    private readonly _modals: Modal[];
    private _closed = false;

    /**
     * The type of the component to present, or its module ID.
     */
    public readonly viewModel: string | Type;

    /**
     * The model to pass to the `activate` life cycle method of the component.
     */
    public readonly model?: TModel;

    /**
     * The `Compose` instance presenting the component.
     */
    public compose: Compose | undefined;

    /**
     * True if the modal is busy, false if the modal is not busy, or null
     * if the modal is technically not busy, but should still appear as busy, e.g.
     * because it is in the process of closing.
     * Note that all interaction with the modal is blocked when this is not false.
     */
    public busy: boolean | null  = false;

    /**
     * The promise that will be resolved when the modal is closed.
     */
    public get promise(): Promise<TResult>
    {
        return this._promiseController.promise;
    }

    /**
     * Attempts to close all open modals, up to an including this.
     * @param reason The reason for closing the modals, which may affect how the modals responds.
     * @returns A promise that will be resolved with true if all modals accepted the close request,
     * or false if one of them rejected it with a reason other than an `Error` instance.
     */
    public async closeAll(reason?: ModalCloseReason): Promise<boolean>
    {
        console.info("Attempting to close all modals, starting from this", { modal: this, reason, modals: this._modals });

        const index = this._modals.findIndex(m => m === this);

        for (const modal of this._modals.slice(0, index + 1).reverse())
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
     * Closes the modal.
     * @param reason The reason for closing the modal, which may affect how the modal responds.
     * Standard reasons include `backdrop-clicked` and `navigation`, but it may be anything.
     * @returns A promise that will be resolved with true if the modal accepted the close request,
     * or false if it rejected it with a reason other than an `Error` instance.
     */
    public async close(reason?: ModalCloseReason): Promise<boolean>
    {
        if (this._closed)
        {
            return true;
        }

        console.info("Attempting to close modal", { modal: this, reason });

        if (this._modals[this._modals.length - 1] !== this)
        {
            console.error("The modal being closed is not at the top of the stack", { modal: this });
        }

        let result: TResult | undefined;

        const compose = this.compose as any;

        if (compose?.currentViewModel?.deactivate)
        {
            try
            {
                result = await compose.currentViewModel.deactivate(reason);
            }
            catch (reason)
            {
                if (reason instanceof Error)
                {
                    console.warn("Modal failed to close", { modal: this, reason });

                    throw reason;
                }

                console.warn("Modal refused to close", { modal: this, reason });

                return false;
            }
        }
        else
        {
            await Promise.resolve();
        }

        const index = this._modals.findIndex(m => m === this);
        this._modals.splice(index, 1);

        this._closed = true;

        console.info("Modal closed", { modal: this, result });

        this._promiseController.resolve(result);

        return true;
    }

    /**
     * Called when the `compose` property is set.
     * @param compose The `Compose` instance presenting the component.
     */
    private async onComposeSet(compose: any): Promise<void>
    {
        try
        {
            await compose.pendingTask;

            console.info("Modal opened", { modal: this });
        }
        catch (reason)
        {
            const index = this._modals.findIndex(m => m === this);

            if (index >= 0)
            {
                this._modals.splice(index, 1);
            }

            this._closed = true;

            if (reason instanceof Error)
            {
                console.error("Modal failed to open", { modal: this, reason });
            }
            else
            {
                console.warn("Modal refused to open", { modal: this, reason });
            }

            this._promiseController.reject(reason);
        }
    }
}
