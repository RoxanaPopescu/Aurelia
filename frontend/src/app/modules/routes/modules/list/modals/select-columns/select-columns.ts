import { autoinject } from "aurelia-framework";
import { RouteListColumnSlug, RouteListColumn } from "app/model/route/entities/route-list-column";
import { Modal } from "shared/framework";

@autoinject
export class SelectColumnsPanel
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
    private _result: RouteListColumn[] | undefined;

    /**
     * The selected columns
     */
    protected columns: RouteListColumnSlug[];

    /**
     * All possible columns
     */
    protected allColumns = Object.keys(RouteListColumn.values).map(slug => new RouteListColumn(slug as any));

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: RouteListColumn[]): void
    {
        this.columns = model.map(o => o.slug);
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected list of columns
     */
    public async deactivate(): Promise<RouteListColumn[] | undefined>
    {
        return this._result;
    }

    /**
     * Called when a column type is clicked
     */
    protected async onSaveClick(): Promise<void>
    {
        localStorage.setItem("route-columns", JSON.stringify(this.columns));
        this._result = this.columns.map(slug => new RouteListColumn(slug));
        await this._modal.close();
    }
}
