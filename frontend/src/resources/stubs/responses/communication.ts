// tslint:disable
export default
{
    "GET /api/v1/communication/triggers/list":
    {
      data:
      [
        {
          "slug": "trigger-2",
          "name": "Trigger 2",
          "sender": "Coop Mad",
          "receiver": "receiver-1-slug",
          "triggerEvent": "delivery",
          "messageType": "email"
        },
        {
          "slug": "trigger-1",
          "name": "Trigger 1",
          "sender": "Coop Mad",
          "receiver": "receiver-1-slug",
          "triggerEvent": "delivery",
          "messageType": "email"
        }
      ]
    },

    "GET /api/v1/communication/triggers/details":
    {
      data:
      {
        // TODO
      }
    },

    "POST /api/v1/communication/triggers/delete":
    {
      status: 201
    }
}
