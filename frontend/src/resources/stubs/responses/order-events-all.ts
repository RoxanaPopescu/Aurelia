// tslint:disable
import { DateTime } from "luxon";

const orderModel =
{
    // TODO
};

const routeModel =
{
    id: "route-1-id",
    reference: "0940-01F-MV",
    slug: "R11189801755",
    tags:
    [
        "tag-1",
        "tag-2",
        "tag-3"
    ],
    executors:
    [
        "executor-1-id",
        "executor-2-id"
    ]
};

const driverModel =
{
    id: "driver-1-id",
    preferredname: "John",
    fullName: "John Doe",
    phone:
    {
        nationalNumber: "33445566",
        countryCallingCode: "45",
        countryCode: "DK"
    },
    email: "johndoe@example.com",
    executor:
    {
        id: "executor-1-id",
        name: "Mover"
    }
};

const locationModel =
{
    address:
    {
        primary: "Vallensbækvej 51",
        secondary: "2605 Brøndby"
    },
    position:
    {
        latitude: 12.123,
        longitude: 11.333
    },
    timeZone: "Europe/Copenhagen"
};

const contactModel =
{
    preferredName: "Jane",
    fullName: "Jane Doe",
    phone:
    {
        nationalNumber: "22334455",
        countryCallingCode: "45",
        countryCode: "DK"
    },
    email: "janedoe@example.com",
    companyName: "Foo A/S"
};

const colloModel =
{
    id: "collo-3-id",
    barcode: "345678912",
    tags:
    [
        "tag-1",
        "tag-2",
        "tag-3"
    ]
};

const deviationModel =
{
    name: "Missing colli",
    description: "Some of the colli were not ready for pickup",
    imageUrls:
    [
        "https://via.placeholder.com/800x600",
        "https://via.placeholder.com/800x600",
        "https://via.placeholder.com/800x600"
    ]
};

const actionByModel =
{
    user:
    {
        id: "user-1-id",
        preferredName: "John",
        fullName: "John Doe",
        imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
        roleName: "Driver"
    },
    organization:
    {
        id: "organization-2-id",
        name: "Mover"
    }
};

const timeFrameModel = { from: DateTime.local(), to: DateTime.local().plus({ hours: 1 }) };

const dateTime = DateTime.local();
const timeSpan = 60000;

export default
{
    "POST /api/v2/orders/events":
    {
        delay: 1000,
        body:
        [
            {
                id: "order-event-1-id",
                eventType: "OrderPickupArrived",
                data:
                {
                    "order": orderModel,
                    "route": routeModel,
                    "driver": driverModel,
                    "pickupLocation": locationModel,
                    "pickupContact": contactModel,
                    "deliveryContact": contactModel,
                    "deliveryTimeFrame": timeFrameModel,
                    "deliveryEta": dateTime,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "OrderDeliveryEtaProvided",
                data:
                {
                    "order": orderModel,
                    "route": routeModel,
                    "driver": driverModel,
                    "pickupLocation": locationModel,
                    "pickupContact": contactModel,
                    "deliveryContact": contactModel,
                    "deliveryTimeFrame": timeFrameModel,
                    "deliveryEta": dateTime.plus({ minutes: 30 }),
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "OrderDeliveryCompleted",
                data:
                {
                    "order": orderModel,
                    "route": routeModel,
                    "driver": driverModel,
                    "pickupLocation": locationModel,
                    "deliveryLocation": locationModel,
                    "pickupContact": contactModel,
                    "deliveryContact": contactModel,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "OrderDeliveryArrived",
                data:
                {
                    "order": orderModel,
                    "route": routeModel,
                    "driver": driverModel,
                    "deliveryLocation": locationModel,
                    "pickupContact": contactModel,
                    "deliveryContact": contactModel,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "OrderDeliveryFailed",
                data:
                {
                    "order": orderModel,
                    "route": routeModel,
                    "driver": driverModel,
                    "deliveryLocation": locationModel,
                    "pickupContact": contactModel,
                    "deliveryContact": contactModel,
                    "deviation": deviationModel,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "OrderPickupCompleted",
                data:
                {
                    "order": orderModel,
                    "route": routeModel,
                    "driver": driverModel,
                    "pickupLocation": locationModel,
                    "deliveryLocation": locationModel,
                    "pickupContact": contactModel,
                    "deliveryContact": contactModel,
                    "deliveryTimeFrame": timeFrameModel,
                    "deliveryEta": dateTime,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "OrderPickupFailed",
                data:
                {
                    "order": orderModel,
                    "route": routeModel,
                    "driver": driverModel,
                    "pickupLocation": locationModel,
                    "pickupContact": contactModel,
                    "deliveryContact": contactModel,
                    "deviation": deviationModel,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "OrderAddedToRoute",
                data:
                {
                    "order": orderModel,
                    "route": routeModel,
                    "driver": driverModel,
                    "pickupLocation": locationModel,
                    "pickupContact": contactModel,
                    "pickupTimeFrame": timeFrameModel,
                    "pickupEta": { "timeofarrival": dateTime, "tasktime": timeSpan},
                    "deliveryLocation": locationModel,
                    "deliveryContact": contactModel,
                    "deliveryTimeFrame": timeFrameModel,
                    "deliveryEta": { "timeofarrival": dateTime, "tasktime": timeSpan},
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "CollectionPointColloDamaged",
                data:
                {
                    "collectionPointId": "//guid",
                    "collo": colloModel,
                    "order": orderModel,
                    "location": locationModel,
                    "deviation": deviationModel,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "StagingColloValidated",
                data:
                {
                    "order": orderModel,
                    "collo": colloModel,
                    "route": routeModel,
                    "location": locationModel,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "StagingColloDamaged",
                data:
                {
                    "order": orderModel,
                    "collo": colloModel,
                    "route": routeModel,
                    "location": locationModel,
                    "contact": contactModel,
                    "driver": driverModel,
                    "deviation": deviationModel,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            },
            {
                id: "order-event-1-id",
                eventType: "StagingColloMissing",
                data:
                {
                    "order": orderModel,
                    "collo": colloModel,
                    "route": routeModel,
                    "location": locationModel,
                    "contact": contactModel,
                    "driver": driverModel,
                    "deviation": deviationModel,
                    "actionBy": actionByModel,
                    "timeOfEvent": dateTime
                }
            }
        ]
    }
}
