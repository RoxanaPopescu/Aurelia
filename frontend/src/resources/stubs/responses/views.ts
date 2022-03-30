// tslint:disable
export default
{
    "GET /api/v2/views?type=route":
    {
        delay: 1000,
        body:
        [
            {
                "id": "route-view-1-id",
                "type": "route",
                "name": "Test",
                "state": {
                    "sorting": {
                        "property": "start-date",
                        "direction": "descending"
                    },
                    "columns": [
                        "slug",
                        "reference",
                        "start-date",
                        "start-address",
                        "tags",
                        "stop-count",
                        "vehicle-type",
                        "status",
                        "driving-list"
                    ],
                    "pageSize": "100",
                    "filters": {
                        "assignedDriver": false,
                        "notAssignedDriver": false,
                        "assignedVehicle": false,
                        "notAssignedVehicle": false,
                        "tagsFilter": []
                    }
                }
            }
        ]
    },
    "POST /api/v2/views/create":
    {
        delay: 1000,
        body:
        {
            "id": "route-view-2-id",
            "type": "route",
            "name": "Test",
            "state": {
                "sorting": {
                    "property": "start-date",
                    "direction": "descending"
                },
                "columns": [
                    "slug",
                    "reference",
                    "start-date",
                    "start-address",
                    "tags",
                    "stop-count",
                    "vehicle-type",
                    "status",
                    "driving-list"
                ],
                "pageSize": "100",
                "filters": {
                    "assignedDriver": false,
                    "notAssignedDriver": false,
                    "assignedVehicle": false,
                    "notAssignedVehicle": false,
                    "tagsFilter": []
                }
            }
        }
    },
    "POST /api/v2/views/route-view-1-id/delete":
    {
        status: 204
    },
    "POST /api/v2/views/route-view-2-id/delete":
    {
        status: 204
    }
}
