import placeholderDescriptions from "../strings/message-placeholder-descriptions.json";

export default
{
    "order-pickup-completed":
    {
        recipientTypes:
        [
            "delivery-customer"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryCustomerName",
            "PickupLocationAddress",
            "DeliveryLocationAddress",
            "DeliveryTimeFrame",
            "DriverPhone",
            "DriverName",
            "DeliveryEtaDate",
            "DeliveryEtaTime"
        ])
    },
    "order-delivery-arrived":
    {
        recipientTypes:
        [
            "delivery-customer"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryCustomerName",
            "DeliveryLocationAddress",
            "DeliveryTimeFrame",
            "DriverPhone",
            "DriverName"
        ])
    },
    "order-delivery-eta-provided":
    {
        recipientTypes:
        [
            "delivery-customer"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryCustomerName",
            "DeliveryLocationAddress",
            "DeliveryTimeFrame",
            "DeliveryEtaDate",
            "DeliveryEtaTime",
            "DriverPhone",
            "DriverName"
        ])
    },
    "order-pickup-eta-provided":
    {
        recipientTypes:
        [
            "pickup-customer"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "PickupCustomerName",
            "PickupLocationAddress",
            "PickupTimeFrame",
            "PickupEtaDate",
            "PickupEtaTime",
            "DriverPhone",
            "DriverName"
        ])
    }
};

function getPlaceholders(placeholders: string[]): { placeholder: string; description: string }[]
{
    return placeholders.map(placeholder => ({ placeholder: `{${placeholder}}`, description: placeholderDescriptions[placeholder] }));
}
