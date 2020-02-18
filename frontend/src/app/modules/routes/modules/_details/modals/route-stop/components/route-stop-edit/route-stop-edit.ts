import { autoinject, bindable } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { RouteStop, Route, RouteStopStatus } from "app/model/route";
import { RouteStopType } from '../../../../../../../../model/route/entities/route-stop-type';

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
     * The available stop types.
     */
    protected types = Object.keys(RouteStopType.values).map(slug => ({ slug, ...RouteStopType.values[slug] }));

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
