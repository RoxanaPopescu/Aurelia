import { autoinject, computedFrom } from "aurelia-framework";
import { Modal, IValidation } from "shared/framework";
import { AgreementService, ConsignorAgreementInvite } from "app/model/agreement";

@autoinject
export class AddConsignorAgreementDialogCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modal The `Modal` instance representing the modal.
     * @param agreementService The `AgreementService`instance.
     */
    public constructor(modal: Modal, agreementService: AgreementService)
    {
        this._modal = modal;
        this._agreementService = agreementService;
    }

    private readonly _modal: Modal;
    private readonly _agreementService: AgreementService;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    protected model: ConsignorAgreementInvite;

    /**
     * The computed outfit slug, which is the slug specified by the user,
     * or if not specified, a suggestion based on the outfit name.
     */
    @computedFrom("model.outfitSlug", "model.outfitName")
    protected get computedOutfitSlug(): string
    {
        return this.model.outfitSlug || (this.model.outfitName || "").replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use for the modal.
     */
    public activate(model?: ConsignorAgreementInvite): void
    {
        this.model = model || new ConsignorAgreementInvite();
    }

    /**
     * Called when one of the buttons are clicked.
     */
    protected async onInviteClick(): Promise<void>
    {
        if (!this.model.outfitSlug)
        {
            this.model.outfitSlug = this.computedOutfitSlug;
        }

        this.validation.active = true;

        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            await this._agreementService.inviteConsignor(this.model);
            await this._modal.close();
        }
        catch (error)
        {
            // TODO: Show proper error message.
            alert(`Failed to create agreement: ${error}`);
        }
    }
}
