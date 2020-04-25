// tslint:disable
export default
{
    "POST /api/v1/communication/triggers/list":
    {
      data:
      [
        {
          "id": "trigger-1-id",
          "slug": "trigger-1-slug",
          "name": "Trigger 1",
          "triggerEvent": "order-delivery-arrived",
          "recipient": "delivery-customer",
          "senderName": "Sender 1",
          "messageType": "email"
        }
      ]
    },

    "POST /api/v1/communication/triggers/details":
    {
      data:
      {
        metadata:
        {
          created: "2020-03-05T08:32+02:00",
          createdBy: { id: "", username: "tda@mover.dk", email: "tda@mover.dk", firstName: "Thomas", lastName: "Darling" },
          lastModified: "2020-03-05T09:52+02:00",
          lastModifiedBy: { id: "", username: "tda@mover.dk", email: "tda@mover.dk", firstName: "Thomas", lastName: "Darling" }
        },
        "id": "trigger-1-id",
        "slug": "trigger-1-slug",
        "name": "Trigger 1",
        "customer": "a02d82f2-fcbe-49eb-a2c7-4212687f841b",
        "routeTags": [],
        "stopTags": [],
        "triggerEvent": "order-delivery-arrived",
        "parameters": {},
        "recipient": "delivery-customer",
        "message":
        {
          "senderName": "Sender 1",
          "messageType": "email",
          "messageTitle": "Message title",
          "messageBody": "Message body"
        }
      }
    },

    "POST /api/v1/communication/triggers/update":
    {
      data:
      {
        metadata:
        {
          created: "2020-03-05T08:32+02:00",
          createdBy: { id: "", username: "tda@mover.dk", email: "tda@mover.dk", firstName: "Thomas", lastName: "Darling" },
          lastModified: "2020-03-05T09:52+02:00",
          lastModifiedBy: { id: "", username: "tda@mover.dk", email: "tda@mover.dk", firstName: "Thomas", lastName: "Darling" }
        },
        "id": "trigger-1-id",
        "slug": "trigger-1-slug"
      }
    },

    "POST /api/v1/communication/triggers/create":
    {
      data:
      {
        metadata:
        {
          created: "2020-03-05T08:32+02:00",
          createdBy: { id: "", username: "tda@mover.dk", email: "tda@mover.dk", firstName: "Thomas", lastName: "Darling" },
          lastModified: "2020-03-05T09:52+02:00",
          lastModifiedBy: { id: "", username: "tda@mover.dk", email: "tda@mover.dk", firstName: "Thomas", lastName: "Darling" }
        },
        "id": "trigger-1-id",
        "slug": "trigger-1-slug"
      }
    },

    "POST /api/v1/communication/triggers/delete":
    {
      status: 201
    }
}
