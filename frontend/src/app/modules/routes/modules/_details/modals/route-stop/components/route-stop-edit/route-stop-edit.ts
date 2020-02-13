import { autoinject, bindable } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStop, Route } from "app/model/route";

@autoinject
export class RouteStopEditCustomElement
{
    @bindable
    public onSave: () => void;

    @bindable
    public onCancel: () => void;

    /**
     * The model for the modal.
     */
    @bindable
    protected model: { route: Route; routeStop: RouteStop; isNew: boolean };

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;
}
