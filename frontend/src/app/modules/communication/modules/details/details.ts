import { autoinject, computedFrom } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { CommunicationService, CommunicationTrigger, CommunicationTriggerEvent, CommunicationRecipient, CommunicationMessageType } from "app/model/_communication";
import { Outfit } from "app/model/outfit";
import { IdentityService } from "app/services/identity";
import { OrganizationService } from "app/model/organization";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";

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
     * @param organizationService The `OrganizationService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(communicationService: CommunicationService, organizationService: OrganizationService, router: Router, identityService: IdentityService)
    {
        this._communicationService = communicationService;
        this._organizationService = organizationService;
        this._router = router;
        this._identityService = identityService;
    }

    private readonly _communicationService: CommunicationService;
    private readonly _organizationService: OrganizationService;
    private readonly _identityService: IdentityService;
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
     * If updating or adding the trigger.
     */
    protected loading: boolean = false;

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
     * The available customers #TODO: Should use new models.
     */
    protected availableCustomers: Outfit[];

    /**
     * Gets the message types, filtered based on the chosen recipient type.
     */
    @computedFrom("model.recipientType.slug", "options.messageTypes.length")
    protected get filteredMessageTypes(): CommunicationMessageType[]
    {
        if (this.model.recipientType == null)
        {
            return [];
        }

        if (this.model.recipientType.slug === "custom-email")
        {
            return this.options?.messageTypes.filter(mt => mt.slug === "email") ?? [];
        }

        if (this.model.recipientType.slug === "custom-phone")
        {
            return this.options?.messageTypes.filter(mt => mt.slug === "sms") ?? [];
        }

        return this.options?.messageTypes ?? [];
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
            this.setAvailableOptions(this.model.eventType, this.model.recipientType, this.model.messageType);

            addToRecentEntities(this.model.toEntityInfo());
        }
        else
        {
            this.model = new CommunicationTrigger();
        }

        this.availableCustomers = [];

        const connections = await this._organizationService.getConnections();
        this.availableCustomers.push(...connections.map(c => new Outfit({ id: c.organization.id, companyName: c.organization.name })));
        this.availableCustomers.push(this._identityService.identity!.organization!);
    }

    /**
     * Called to link the creator id to customerName in the UI
     * @param params the id of the creator
     * @returns The outfit if found
     */
    protected getCreatorFromId(id: string): Outfit | undefined
    {
        return this.availableCustomers.find(c => c.id === id);
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

        this.loading = true;

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
        finally
        {
            this.loading = false;
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

            // tslint:disable-next-line:deprecation
            document.execCommand("insertText", false, placeholder);
        });
    }

    protected setAvailableOptions(eventType: CommunicationTriggerEvent, recipientType: CommunicationRecipient, messageType: CommunicationMessageType): void
    {
        const options = this._communicationService.getOptions(eventType.slug);

        this.options =
        {
            recipientTypes: options.recipientTypes
                .map(r => new CommunicationRecipient(r)),

            messageTypes: options.messageTypes
                .filter(t => t !== "app-push" || recipientType.slug === "driver")
                .map(r => new CommunicationMessageType(r)),

            placeholders: options.placeholders
        };

        if (recipientType != null && !options.recipientTypes.includes(recipientType.slug))
        {
            this.model.recipientType = undefined as any;
        }

        if (messageType != null && !options.messageTypes.includes(messageType.slug))
        {
            this.model.messageType = undefined as any;
        }

        if (messageType != null && messageType.slug === "app-push" && (recipientType == null || recipientType.slug !== "driver"))
        {
            this.model.messageType = undefined as any;
        }

        if (recipientType != null && messageType != null)
        {
            if (recipientType.slug === "custom-email" && messageType.slug !== "email")
            {
                this.model.messageType = undefined as any;
                this.model.to = undefined as any;
            }

            if (recipientType.slug === "custom-phone" && messageType.slug !== "sms")
            {
                this.model.messageType = undefined as any;
                this.model.to = undefined as any;
            }
        }

        if (recipientType != null && recipientType.slug === "custom-email")
        {
            this.model.messageType = this.options.messageTypes.find(mt => mt.slug === "email");
        }

        if (recipientType != null && recipientType.slug === "custom-phone")
        {
            this.model.messageType = this.options.messageTypes.find(mt => mt.slug === "sms");
        }
    }
}
