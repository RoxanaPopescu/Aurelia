const settings =
{
    "id": "automatic-dispatch-settings-1-id",
    "name": "Automatic dispatch settings 1",
    "paused": false,
    "createdAt": "2020-03-05T08:32+02:00",
    "updatedAt": "2020-03-06T12:47+02:00",
    "shipmentFilter":
    {
        "organizations": [],
        "vehicleTypes": [],
        "pickupLeadTime": 60
    },
    "routeFilter":
    {
        "organizations": [],
        "tags": [],
        "pickupLeadTime": 60
    }
};

export default
{
    "GET /api/v2/automatic-dispatch/settings":
    {
        body: [settings]
    },

    "GET /api/v2/automatic-dispatch/settings/automatic-dispatch-settings-1-id":
    {
        body: settings
    },

    "POST /api/v2/automatic-dispatch/settings/create":
    {
        body: settings
    },

    "POST /api/v2/automatic-dispatch/settings/update":
    {
        body: settings
    },

    "POST /api/v2/automatic-dispatch/settings/delete":
    {
        status: 201
    },

    "POST /api/v2/automatic-dispatch/settings/pause":
    {
        body: settings
    },

    "POST /api/v2/automatic-dispatch/settings/unpause":
    {
        body: settings
    }
};
