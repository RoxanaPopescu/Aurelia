import { SearchModel } from "app/model/search-model";
import { CommunicationRecipient } from "./communication-recipient";
import { CommunicationTriggerEvent } from "./communication-trigger-event";
import { CommunicationMessageType } from "./communication-message-type";

export class CommunicationTriggerInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.slug = data.slug;
        this.name = data.name;
        this.customer = data.customer;
        this.routeTags = data.routeTags;
        this.stopTags = data.stopTags;
        this.orderTags = data.orderTags;
        this.eventType = new CommunicationTriggerEvent(data.eventType);
        this.fromName = data.fromName;
        this.messageType = new CommunicationMessageType(data.messageType);

        if (data.recipientType != null)
        {
            this.recipientType = new CommunicationRecipient(data.recipientType);
        }
        else
        {
            this.recipientType = new CommunicationRecipient("custom");
        }
    }

    /**
     * The ID of the comunication trigger.
     */
    public readonly id: string;

    /**
     * The slug identifying the comunication trigger.
     */
    public readonly slug: string;

    /**
     * The name of the comunication trigger.
     */
    public readonly name: string;

    /**
     * The customer for which this trigger should be enabled.
     */
    public readonly customer: string;

    /**
     * The route tags for which this trigger should be enabled.
     */
    public readonly routeTags: string[] | undefined;

    /**
     * The route stop tags for which this trigger should be enabled.
     */
    public readonly stopTags: string[] | undefined;

    /**
     * The order stop tags for which this trigger should be enabled.
     */
    public readonly orderTags: string[] | undefined;

    /**
     * The recipient of the message.
     */
    public readonly recipientType: CommunicationRecipient;

    /**
     * The event for which the message should be sent.
     */
    public readonly eventType: CommunicationTriggerEvent;

    /**
     * The name of the sender, as seen by the recipient when the message is received.
     */
    public readonly fromName: string;

    /**
     * The type of message to send.
     */
    public readonly messageType: CommunicationMessageType;

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);
}
