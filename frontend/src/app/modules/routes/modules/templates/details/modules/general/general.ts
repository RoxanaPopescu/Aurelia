import { autoinject, bindable, computedFrom} from "aurelia-framework";
import { RouteTemplate } from "app/model/route-template";
import { Consignor } from "app/model/outfit";
import { Session } from "shared/src/model/session";
import { AgreementService } from "app/model/agreement";

/**
 * Represents the page.
 */
@autoinject
export class General
{
    /**
     * Creates a new instance of the class.
     * @param agreementService The `AgreementService` instance.
     */
    public constructor(
        agreementService: AgreementService
    ){
        this._agreementService = agreementService;

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            const response = await this._agreementService.getAll();
            this.consignors = response.agreements.filter(c => c.type.slug === "consignor");

        })();
    }

    private readonly _agreementService: AgreementService;

    /**
     * The template to present.
     */
    @bindable
    protected template: RouteTemplate;

    /**
     * The available consignors.
     */
    protected consignors: Consignor[];

    /**
     * The current consignor.
     */
    @computedFrom("consignors", "template.routeOwnerId")
    protected get currentRouteOwner(): undefined | Consignor
    {
        if (this.template == null || this.template.routeOwnerId == null || this.consignors == null) {
            return undefined
        }

        return this.consignors.find(c => c.id === this.template.routeOwnerId);
    }

    protected set currentRouteOwner(consignor: undefined | Consignor)
    {
        if (this.template != null && consignor != null) {
            this.template.routeOwnerId = consignor?.id;
        }
    }

    /**
     * The available vehicle types.
     */
    protected vehicleTypes = Session.vehicleTypes;
}