import { SearchModel } from "app/model/search-model";
import { CommunicationRecipient } from "./communication-recipient";
import { CommunicationTriggerEvent } from "./communication-trigger-event";
import { CommunicationMessageType } from "./communication-message-type";
import { Metadata } from "app/model/shared/entities/metadata";
import { CommunicationParameters } from "./communication-parameters";

export class CommunicationTrigger
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.metadata = new Metadata(data.metadata);
            this.id = data.id;
            this.slug = data.slug;
            this.name = data.name;
            this.customer = data.customer;
            this.routeTags = data.routeTags;
            this.stopTags = data.stopTags;
            this.triggerEvent = new CommunicationTriggerEvent(data.triggerEvent);
            this.recipient = new CommunicationRecipient(data.recipient);
            this.senderName = data.senderName;
            this.messageType = new CommunicationMessageType(data.messageType);
            this.messageTitle = data.messageTitle;
            this.messageBody = data.messageBody;
            this.parameters = new CommunicationParameters(data.parameters);
        }
        else
        {
            this.parameters = new CommunicationParameters();
        }
    }

    /**
     * The metadata for the entity.
     */
    public metadata: Metadata | undefined;

    /**
     * The ID of the comunication trigger.
     */
    public id: string;

    /**
     * The slug identifying the comunication trigger.
     */
    public slug: string;

    /**
     * The name of the comunication trigger.
     */
    public name: string;

    /**
     * The customer for which this trigger should be enabled.
     */
    public customer: string;

    /**
     * The route tags for which this trigger should be enabled.
     */
    public routeTags: string[] | undefined;

    /**
     * The route stop tags for which this trigger should be enabled.
     */
    public stopTags: string[] | undefined;

    /**
     * The event for which the message should be sent.
     */
    public triggerEvent: CommunicationTriggerEvent;

    /**
     * The recipient of the message.
     */
    public recipient: CommunicationRecipient;

    /**
     * The name of the sender, as seen by the recipient when the message is received.
     */
    public senderName: string;

    /**
     * The type of message to send.
     */
    public messageType: CommunicationMessageType;

    /**
     * The title of the message.
     */
    public messageTitle: CommunicationMessageType;

    /**
     * The body of the message.
     */
    public messageBody: CommunicationMessageType;

    /**
     * The parameters to use, which depend on the trigger event.
     */
    public parameters: any;

    /**
     * The model representing the searchable text in the entity.
     */
    public searchModel = new SearchModel(this);

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = {...this};

        delete data.metadata;
        delete data.searchModel;

        return data;
    }
}
