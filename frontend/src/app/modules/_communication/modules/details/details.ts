import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { CommunicationService, CommunicationTrigger, CommunicationTriggerEvent, CommunicationRecipient, CommunicationMessageType } from "app/model/_communication";

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
     */
    public constructor(communicationService: CommunicationService)
    {
        this._communicationService = communicationService;
    }

    private readonly _communicationService: CommunicationService;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model to present.
     */
    protected model: CommunicationTrigger;

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
     * The available customers.
     */
    protected availableCustomers = [];

    /**
     * The available recipients.
     */
    protected availableRecipients = Object.keys(CommunicationRecipient.values)
        .map(key => new CommunicationRecipient(key as any));

    /**
     * The available message types.
     */
    protected availableMessageTypes = Object.keys(CommunicationMessageType.values)
        .map(key => new CommunicationMessageType(key as any));

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
            this.setAvailableOptions(this.model.triggerEvent, this.model.recipient);
        }
        else
        {
            this.model = new CommunicationTrigger();
        }
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
            }
            else
            {
                await this._communicationService.update(this.model);
            }
        }
        catch (error)
        {
            Log.error("Could not save the route planning settings", error);
        }
    }

    protected setAvailableOptions(triggerEvent: CommunicationTriggerEvent, recipient: CommunicationRecipient): void
    {
        const options = this._communicationService.getOptions(triggerEvent.slug);

        this.options =
        {
            recipients: options.recipients
                .map(r => new CommunicationRecipient(r)),

            messageTypes: options.messageTypes
                .filter(t => t !== "push-to-driver" || recipient.slug === "driver")
                .map(r => new CommunicationMessageType(r)),

            placeholders: options.placeholders
        };

        if (this.model.recipient != null && !options.recipients.includes(this.model.recipient.slug))
        {
            this.model.recipient = undefined as any;
        }

        if (this.model.messageType != null && !options.messageTypes.includes(this.model.messageType.slug))
        {
            this.model.messageType = undefined as any;
        }

        if (this.model.messageType != null && this.model.messageType.slug === "push-to-driver" && (this.model.recipient == null || this.model.recipient.slug !== "driver"))
        {
            this.model.messageType = undefined as any;
        }
    }
}
