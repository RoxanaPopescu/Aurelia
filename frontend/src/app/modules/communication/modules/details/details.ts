import { autoinject, computedFrom } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { CommunicationService, CommunicationTrigger, CommunicationTriggerEvent, CommunicationRecipient, CommunicationMessageType } from "app/model/_communication";
import { AgreementService } from "app/model/agreement";
import { Outfit } from "app/model/outfit";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The slug identifying the trigger, or undefined if new.
     */
    slug?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param communicationService The `CommunicationService` instance.
     * @param agreementService The `AgreementService` instance.
     */
    public constructor(communicationService: CommunicationService, agreementService: AgreementService, router: Router)
    {
        this._communicationService = communicationService;
        this._agreementService = agreementService;
        this._router = router;
    }

    private readonly _communicationService: CommunicationService;
    private readonly _agreementService: AgreementService;
    private readonly _router: Router;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The message input element.
     */
    protected messageInputElement: HTMLElement;

    /**
     * The model to present.
     */
    protected model: CommunicationTrigger;

    /**
     * The name of the trigger, at the time it was last saved.
     */
    protected triggerName: string;

    /**
     * The available options, based on the selected trigger event.
     */
    protected options: any;

    /**
     * The available trigger events.
     */
    protected availableTriggerEvents = Object.keys(CommunicationTriggerEvent.values)
        .map(key => new CommunicationTriggerEvent(key as any));

    /**
     * The available customers - i.e. consignors.
     */
    protected availableCustomers: Outfit[];

    /**
     * The selected customer, if any.
     */
    @computedFrom("model.customer", "availableCustomers")
    protected get selectedCustomer(): Outfit | undefined
    {
        return this.availableCustomers.find(c => c.id === this.model.customer);
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IRouteParams): Promise<void>
    {
        if (params.slug != null)
        {
            this.model = await this._communicationService.get(params.slug);
            this.triggerName = this.model.name;
            this.setAvailableOptions(this.model.eventType, this.model.recipientType);
        }
        else
        {
            this.model = new CommunicationTrigger();
        }

        this.availableCustomers = (await this._agreementService.getAll()).agreements.filter(a => a.type.slug === "consignor");
    }

    /**
     * Called when the "Save changes" og "Create trigger" button is clicked.
     * Saves the model.
     */
    protected async onSaveClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            if (this.model.slug == null)
            {
                await this._communicationService.create(this.model);

                this._router.navigate("/communication/list");
            }
            else
            {
                await this._communicationService.update(this.model);

                this.triggerName = this.model.name;
            }
        }
        catch (error)
        {
            Log.error("Could not save the communication trigger", error);
        }
    }

    /**
     * Called when a message placeholder is clicked.
     * Inserts the placeholder into the message input.
     * @param placeholder The placeholder text to insert.
     */
    protected onMessagePlaceholderClick(placeholder: string): void
    {
        setTimeout(() =>
        {
            (this.messageInputElement.querySelector(".input-input") as HTMLElement).focus();
            document.execCommand("insertText", false, placeholder);
        });
    }

    protected setAvailableOptions(eventType: CommunicationTriggerEvent, recipient: CommunicationRecipient): void
    {
        const options = this._communicationService.getOptions(eventType.slug);

        this.options =
        {
            recipientTypes: options.recipientTypes
                .map(r => new CommunicationRecipient(r)),

            messageTypes: options.messageTypes
                .filter(t => t !== "app-push" || recipient.slug === "driver")
                .map(r => new CommunicationMessageType(r)),

            placeholders: options.placeholders
        };

        if (this.model.recipientType != null && !options.recipientTypes.includes(this.model.recipientType.slug))
        {
            this.model.recipientType = undefined as any;
        }

        if (this.model.messageType != null && !options.messageTypes.includes(this.model.messageType.slug))
        {
            this.model.messageType = undefined as any;
        }

        if (this.model.messageType != null && this.model.messageType.slug === "app-push" && (this.model.recipientType == null || this.model.recipientType.slug !== "driver"))
        {
            this.model.messageType = undefined as any;
        }
    }
}
