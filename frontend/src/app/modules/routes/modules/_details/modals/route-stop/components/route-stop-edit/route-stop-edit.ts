import { autoinject, bindable } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStop, Route, RouteStopStatus } from "app/model/route";

@autoinject
export class RouteStopEditCustomElement
{
    /**
     * The model for the modal.
     */
    @bindable
    protected model: { route: Route; routeStop: RouteStop; isNew: boolean };

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The available statuses.
     */
    protected statuses = Object.keys(RouteStopStatus.values).map(slug => ({ slug, ...RouteStopStatus.values[slug] }));

    /**
     * Called when the `Save` button is pressed.
     */
    @bindable
    public onSave: (atIndex?: number) => void;

    /**
     * Called when the `Cancel` button is pressed.
     */
    @bindable
    public onCancel: () => void;
}
