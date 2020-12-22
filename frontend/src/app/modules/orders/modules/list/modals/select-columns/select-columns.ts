import { OrderListColumn, OrderListColumnSlug } from "app/model/order";
import { autoinject } from "aurelia-framework";
import { Modal } from "shared/framework";

@autoinject
export class OrderSelectColumnsPanel
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private _result: OrderListColumn[] | undefined;

    /**
     * The selected columns
     */
    protected columns: OrderListColumnSlug[];

    /**
     * All possible columns
     */
    protected allColumns = Object.keys(OrderListColumn.values).map(slug => new OrderListColumn(slug as any));

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: OrderListColumn[]): void
    {
        this.columns = model.map(o => o.slug);
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected list of columns
     */
    public async deactivate(): Promise<OrderListColumn[] | undefined>
    {
        return this._result;
    }

    /**
     * Called when a column type is clicked
     */
    protected async onSaveClick(): Promise<void>
    {
        localStorage.setItem("order-columns", JSON.stringify(this.columns));
        this._result = this.columns.map(slug => new OrderListColumn(slug));
        await this._modal.close();
    }
}
