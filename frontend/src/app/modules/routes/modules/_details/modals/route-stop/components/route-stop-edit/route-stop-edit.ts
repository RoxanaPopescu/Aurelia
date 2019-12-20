import { autoinject, bindable } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStop } from "app/model/route";

@autoinject
export class RouteStopEditCustomElement
{
    /**
     * The model for the modal.
     */
    @bindable
    protected model: RouteStop;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;
}
