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
     */
    public async close(): Promise<void>
    {
        if (this._closed)
        {
            return;
        }

        if (this._modals[this._modals.length - 1] !== this)
        {
            throw new Error("Cannot close modal when it is not at the top of the stack.");
        }

        let result: TResult | undefined;

        const compose = (this as IComposedModal).compose;

        if (compose && compose.currentViewModel && compose.currentViewModel.deactivate)
        {
            result = await compose.currentViewModel.deactivate();
        }

        console.log("modal result: ", result);

        this._modals.pop();
        this._closed = true;

        this._promiseController.resolve(result);
    }
}
