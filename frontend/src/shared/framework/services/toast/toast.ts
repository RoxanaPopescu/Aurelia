import { Container, BindingEngine } from "aurelia-framework";
import { Compose } from "aurelia-templating-resources";
import { Type } from "shared/types";
import { PromiseController } from "shared/utilities";
import { ToastCloseReason } from "./toast-close-reason";

/**
 * Represents a toast on the stack.
 */
export class Toast<TModel = any, TResult = any>
{
    /**
     * Creates a new instance of the type.
     * @param toasts The stack of open toasts.
     * @param viewModel The type of the component to present, or its module ID.
     * @param model The model to pass to the `activate` life cycle method of the component.
     */
    public constructor(toasts: Toast[], viewModel: string | Type, model?: TModel)
    {
        this._toasts = toasts;
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
    private readonly _toasts: Toast[];
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
     * True if the toast is busy, false if the toast is not busy, or null
     * if the toast is technically not busy, but should still appear as busy, e.g.
     * because it is in the process of closing.
     * Note that all interaction with the toast is blocked when this is not false.
     */
    public busy: boolean | null  = false;

    /**
     * The promise that will be resolved when the toast is closed.
     */
    public get promise(): Promise<TResult>
    {
        return this._promiseController.promise;
    }

    /**
     * Attempts to close all open toasts, up to an including this.
     * @param reason The reason for closing the toasts, which may affect how the toasts responds.
     * @returns A promise that will be resolved with true if all toasts accepted the close request,
     * or false if one of them rejected it with a reason other than an `Error` instance.
     */
    public async closeAll(reason?: ToastCloseReason): Promise<boolean>
    {
        console.info("Attempting to close all toasts, starting from this.", { toast: this, reason, toasts: this._toasts });

        const index = this._toasts.findIndex(m => m === this);

        for (const toast of this._toasts.slice(0, index + 1).reverse())
        {
            const closed = await toast.close(reason);

            if (!closed)
            {
                return false;
            }
        }

        return true;
    }

    /**
     * Closes the toast.
     * @param reason The reason for closing the toast, which may affect how the toast responds.
     * Standard reasons include "backdrop-clicked" and "navigation", but it may be anything.
     * @returns A promise that will be resolved with true if the toast accepted the close request,
     * or false if it rejected it with a reason other than an `Error` instance.
     */
    public async close(reason?: ToastCloseReason): Promise<boolean>
    {
        if (this._closed)
        {
            return true;
        }

        console.info("Attempting to close toast.", { toast: this, reason });

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
                    console.warn("Toast failed to close.", { toast: this, reason });

                    throw reason;
                }

                console.warn("Toast refused to close.", { toast: this, reason });

                return false;
            }
        }
        else
        {
            await Promise.resolve();
        }

        const index = this._toasts.findIndex(m => m === this);
        this._toasts.splice(index, 1);

        this._closed = true;

        console.info("Toast closed.", { toast: this, result });

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

            console.info("Toast opened.", { toast: this });
        }
        catch (reason)
        {
            const index = this._toasts.findIndex(m => m === this);

            if (index >= 0)
            {
                this._toasts.splice(index, 1);
            }

            this._closed = true;

            if (reason instanceof Error)
            {
                console.error("Toast failed to open.", { toast: this, reason });
            }
            else
            {
                console.warn("Toast refused to open.", { toast: this, reason });
            }

            this._promiseController.reject(reason);
        }
    }
}
