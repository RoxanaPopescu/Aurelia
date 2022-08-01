import placeholderDescriptions from "../strings/message-placeholder-descriptions.json";

export default
{
    "order-pickup-completed":
    {
        recipientTypes:
        [
            "delivery-customer",
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "PickupLocationAddress",
            "DeliveryLocationAddress",
            "DeliveryCustomerName",
            "DeliveryCustomerPhone",
            "DeliveryCustomerEmail",
            "DeliveryTimeFrame",
            "DeliveryEtaDate",
            "DeliveryEtaTime",
            "DriverName",
            "DriverPhone",
            "TrackingId"
        ])
    },
    "order-delivery-arrived":
    {
        recipientTypes:
        [
            "delivery-customer",
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryLocationAddress",
            "DeliveryCustomerName",
            "DeliveryCustomerPhone",
            "DeliveryCustomerEmail",
            "DriverName",
            "DriverPhone",
            "TrackingId"
        ])
    },
    "order-delivery-completed":
    {
        recipientTypes:
        [
            "delivery-customer",
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryLocationAddress",
            "DeliveryCompanyName",
            "DeliveryCustomerName",
            "DeliveryCustomerPhone",
            "DeliveryCustomerEmail",
            "DriverName",
            "DriverPhone"
        ])
    },
    "order-delivery-failed":
    {
        recipientTypes:
        [
            "delivery-customer",
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryLocationAddress",
            "DeliveryCustomerName",
            "DeliveryCustomerPhone",
            "DeliveryCustomerEmail",
            "DriverName",
            "DriverPhone"

        ])
    },
    "order-delivery-delayed-eta-provided":
    {
        recipientTypes:
        [
            "delivery-customer",
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryLocationAddress",
            "DeliveryCustomerName",
            "DeliveryCustomerPhone",
            "DeliveryCustomerEmail",
            "DeliveryTimeFrame",
            "DeliveryEtaDate",
            "DeliveryEtaTime",
            "DriverName",
            "DriverPhone",
            "TrackingId"
        ])
    },
    "order-delivery-eta-provided":
    {
        recipientTypes:
        [
            "delivery-customer",
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryLocationAddress",
            "DeliveryCustomerName",
            "DeliveryCustomerPhone",
            "DeliveryCustomerEmail",
            "DeliveryTimeFrame",
            "DeliveryEtaDate",
            "DeliveryEtaTime",
            "DriverName",
            "DriverPhone",
            "TrackingId"
        ])
    },
    "order-pickup-eta-provided":
    {
        recipientTypes:
        [
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "PickupLocationAddress",
            "PickupCustomerName",
            "PickupCustomerPhone",
            "PickupCustomerEmail",
            "PickupTimeFrame",
            "PickupEtaDate",
            "PickupEtaTime",
            "DriverName",
            "DriverPhone"
        ])
    },
    "order-schedule-triggered":
    {
        recipientTypes:
        [
            "delivery-customer",
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "TrackingId",
            "RelationalId",
            "DeliveryLocationAddress",
            "DeliveryLocationLatitude",
            "DeliveryLocationLongitude",
            "DeliveryCustomerName",
            "DeliveryCustomerPhone",
            "DeliveryCustomerEmail",
            "DeliveryTimeFrame",
            "DeliveryEtaDate",
            "DeliveryEtaTime",
            "DeliveryWeekday",
            "DeliveryDate",
            "PickupLocationAddress",
            "PickupCustomerName",
            "PickupCustomerPhone",
            "PickupCustomerEmail",
            "PickupTimeFrame",
            "PickupEtaDate",
            "PickupEtaTime",
            "PickupWeekday",
            "PickupDate"
        ])
    },
    "specific-time":
    {
        recipientTypes:
        [
            "delivery-customer",
            "pickup-customer",
            "custom-email"
        ],
        messageTypes:
        [
            "sms",
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DeliveryLocationAddress",
            "DeliveryCustomerName",
            "DeliveryCustomerPhone",
            "DeliveryCustomerEmail",
            "DeliveryTimeFrame",
            "DeliveryEtaDate",
            "DeliveryEtaTime",
            "TrackingId"
        ])
    },
    "order-removed-from-route":
    {
        recipientTypes:
        [
            "driver"
        ],
        messageTypes:
        [
            "sms"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "DriverName",
            "DriverPhone"
        ])
    },
    "route-optimization-unscheduled-task":
    {
        recipientTypes:
        [
            "custom-email"
        ],
        messageTypes:
        [
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "OrderId",
            "RelationalId"
        ])
    },
    "route-optimization-job-failed":
    {
        recipientTypes:
        [
            "custom-email"
        ],
        messageTypes:
        [
            "email"
        ],
        placeholders: getPlaceholders(
        [
            "JobName"
        ])
    }
};

function getPlaceholders(placeholders: string[]): { placeholder: string; description: string }[]
{
    return placeholders.map(placeholder => ({ placeholder: `{${placeholder}}`, description: placeholderDescriptions[placeholder] }));
}
