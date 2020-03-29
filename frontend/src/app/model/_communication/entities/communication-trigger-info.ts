import { SearchModel } from "app/model/search-model";
import { CommunicationReceiver } from "./communication-receiver";
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
        this.slug = data.slug;
        this.name = data.name;
        this.sender = data.sender;
        this.receiver = new CommunicationReceiver(data.receiver);
        this.triggerEvent = new CommunicationTriggerEvent(data.triggerEvent);
        this.messageType = new CommunicationMessageType(data.messageType);
    }

    /**
     * The slug identifying the comunication trigger.
     */
    public readonly slug: string;

    /**
     * The name of the comunication trigger.
     */
    public readonly name: string;

    /**
     * The name of the sender, as seen by the receiver when the message is received.
     */
    public readonly sender: string;

    /**
     * The receiver of the message.
     */
    public readonly receiver: CommunicationReceiver;

    /**
     * The event for which the message should be sent.
     */
    public readonly triggerEvent: CommunicationTriggerEvent;

    /**
     * The type of message to send.
     */
    public readonly messageType: CommunicationMessageType;

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);
}
