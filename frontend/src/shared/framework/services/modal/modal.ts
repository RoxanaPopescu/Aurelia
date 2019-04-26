import { PromiseController } from "shared/utilities";
import { Compose } from "aurelia-templating-resources";
import { Type } from "shared/types";

export interface IComposedModal extends Modal
{
    /**
     * The `Compose` instance presenting the component.
     */
    compose?: Compose & { currentViewModel?: any };
}

/**
 * Represents a modal on the stack.
 */
export class Modal<TModel = any, TResult = any>
{
    public constructor(modals: Modal[], viewModel: string | Type, name?: string, model?: TModel)
    {
        this._modals = modals;
        this.viewModel = viewModel;
        this.name = name;
        this.model = model;
    }

    private readonly _promiseController = new PromiseController<any>();
    private readonly _modals: Modal[];
    private _closed = false;

    /**
     * The type of the component to present, or its module ID.
     */
    public readonly viewModel: string | Type;

    /**
     * The name of the component to present, if specified.
     */
    public readonly name?: string;

    /**
     * The model passed to the `activate` life cycle method of the component.
     */
    public readonly model?: TModel;

    /**
     * The promise that will be resolved when the modal is closed.
     */
    public get promise(): Promise<TResult>
    {
        return this._promiseController.promise;
    }

    /**
     * Closes the modal.
     * @param reason The reason for closing the modal, which may affect how the modal responds.
     * @returns A promise that will be resolved with true if the modal accepted the close request,
     * or false if it rejected it with a reason other than an Error instance.
     */
    public async close(reason?: any): Promise<boolean>
    {
        if (this._closed)
        {
            return true;
        }

        if (this._modals[this._modals.length - 1] !== this)
        {
            throw new Error("Cannot close modal when it is not at the top of the stack.");
        }

        let result: TResult | undefined;

        const compose = (this as IComposedModal).compose;

        if (compose && compose.currentViewModel && compose.currentViewModel.deactivate)
        {
            try
            {
                result = await compose.currentViewModel.deactivate(reason);
            }
            catch (reason)
            {
                if (reason instanceof Error)
                {
                    throw reason;
                }

                return false;
            }
        }

        this._modals.pop();
        this._closed = true;

        this._promiseController.resolve(result);

        return true;
    }
}
