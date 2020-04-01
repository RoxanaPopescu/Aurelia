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
        this.recipient = new CommunicationRecipient(data.recipient);
        this.triggerEvent = new CommunicationTriggerEvent(data.triggerEvent);
        this.senderName = data.senderName;
        this.messageType = new CommunicationMessageType(data.messageType);
    }

    /**
     * The slug identifying the comunication trigger.
     */
    public readonly slug: string;

    /**
     * The ID of the comunication trigger.
     */
    public id: string;

    /**
     * The name of the comunication trigger.
     */
    public readonly name: string;

    /**
     * The recipient of the message.
     */
    public readonly recipient: CommunicationRecipient;

    /**
     * The event for which the message should be sent.
     */
    public readonly triggerEvent: CommunicationTriggerEvent;

    /**
     * The name of the sender, as seen by the recipient when the message is received.
     */
    public readonly senderName: string;

    /**
     * The type of message to send.
     */
    public readonly messageType: CommunicationMessageType;

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);
}
