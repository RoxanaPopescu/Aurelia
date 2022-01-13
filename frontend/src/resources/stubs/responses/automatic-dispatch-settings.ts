const settings =
{
    "id": "rule-set-1-id",
    "name": "Rule set 1",
    "paused": false,
    "createdAt": "2020-03-05T08:32+02:00",
    "updatedAt": "2020-03-06T12:47+02:00",
    "shipmentFilter":
    {
        "organizations": [],
        "vehicleTypes": ["2321cbd7-5bed-4035-a827-2bfea31bb8e8"],
        "pickupLeadTime": 3600
    },
    "routeFilter":
    {
        "organizations": [],
        "tags": ["Foo"]
    }
};

export default
{
    "GET /api/v2/automatic-dispatch/settings":
    {
        body: [settings]
    },

    "POST /api/v2/automatic-dispatch/settings/create":
    {
        body: settings
    },

    "GET /api/v2/automatic-dispatch/settings/rule-set-1-id":
    {
        body: settings
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/update":
    {
        body: settings
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/delete":
    {
        status: 201
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/pause":
    {
        body: { ...settings, paused: true }
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/unpause":
    {
        body: { ...settings, paused: false }
    }
};
