const settings =
[
    {
        "id": "rule-set-1-id",
        "name": "Rule set 1",
        "paused": false,
        "createdAt": "2022-01-05T08:32+02:00",
        "updatedAt": "2022-01-06T12:47+02:00",
        "shipmentFilter":
        {
            "organizations": [],
            "vehicleTypes": ["2321cbd7-5bed-4035-a827-2bfea31bb8e8"],
            "pickupLeadTime": 3600
        },
        "routeFilter":
        {
            "organizations": [],
            "tags": ["Foo"],
            "startLeadTime": 3600
        }
    },
    {
        "id": "rule-set-2-id",
        "name": "Rule set 2",
        "paused": true,
        "createdAt": "2022-01-07T09:41+02:00",
        "updatedAt": "2022-01-08T14:05+02:00",
        "shipmentFilter":
        {
            "organizations": [],
            "vehicleTypes": ["2321cbd7-5bed-4035-a827-2bfea31bb8e8"],
            "pickupLeadTime": 3600
        },
        "routeFilter":
        {
            "organizations": [],
            "tags": ["Foo"],
            "startLeadTime": 3600
        }
    }
];

export default
{
    "GET /api/v2/automatic-dispatch/settings":
    {
        body: settings
    },

    "POST /api/v2/automatic-dispatch/settings/create":
    {
        body: settings[0]
    },

    "GET /api/v2/automatic-dispatch/settings/rule-set-1-id":
    {
        body: settings[0]
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/update":
    {
        body: settings[0]
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/delete":
    {
        status: 201
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/pause":
    {
        body: { ...settings[0], paused: true }
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/unpause":
    {
        body: { ...settings[0], paused: false }
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-1-id/run-now":
    {
        status: 201
    },

    "GET /api/v2/automatic-dispatch/settings/rule-set-2-id":
    {
        body: settings[0]
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-2-id/update":
    {
        body: settings[0]
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-2-id/delete":
    {
        status: 201
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-2-id/pause":
    {
        body: { ...settings[0], paused: true }
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-2-id/unpause":
    {
        body: { ...settings[0], paused: false }
    },

    "POST /api/v2/automatic-dispatch/settings/rule-set-2-id/run-now":
    {
        status: 201
    }
};
