export default
{
    "POST /api/v1/routeplanning/settingsv2/list":
    {
        data:
        [
            {
                id: "rule-set-1-id",
                name: "Rule set 1",
                slug: "rule-set-1-slug"
            }
        ]
    },

    "POST /api/v1/routeplanning/settingsv2/details":
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
            id: "rule-set-1-id",
            name: "Rule set 1",
            slug: "rule-set-1-slug",
            "restrictions": {
                "ferriesAllowed": true,
                "privateRoadsAllowed": true,
                "highwaysAllowed": true,
                "uturnStrategy": "allowed",
                "curbApproachStrategy": "either-side-of-vehicle",
                "timeWindowAdjustment": {
                "start": 12,
                "end": 12
                },
                "oneRoutePlanPerStartLocation": true,
                "maxCalculationTime": 60
            },
            "routeCreation": {
                "routeTags": [],
                "manualApproval": false,
                "routeNameTemplate": ""
            },
            "vehicleGroups": [
                {
                "name": "",
                "id": "",
                "cost": {
                    "newRoute": 123,
                    "waitingTime": 12,
                    "drivingTime": 12,
                    "taskTime": 12,
                    "distance": 12
                },
                "vehicleType": "",
                "limits": {
                    "volume": 12,
                    "weight": 1239,
                    "colliCount": 1231,
                    "stopCount": 56,
                    "time": 1231,
                    "distance": 371
                },
                "orderTagsAllRequired": [ "" ],
                "orderTagsOneRequired": [ "" ],
                "startLocation": {
                    "location": {
                    "address": {
                        "primary": "",
                        "secondary": ""
                    },
                    "position": {
                        "latitude": 12.13,
                        "longitude": 55.213
                    }
                    },
                    "taskTime": 12.1
                },
                "endLocation": {
                    "location": {
                    "address": {
                        "primary": "",
                        "secondary": ""
                    },
                    "position": {
                        "latitude": 12.13,
                        "longitude": 55.213
                    }
                    },
                    "taskTime": 12.1
                },
                "routeTags": [ "" ]
                }
            ],
            "departureTimes": [
                {
                "startLocation": {
                    "address": {
                    "primary": "",
                    "secondary": ""
                    },
                    "position": {
                    "latitude": 12.13,
                    "longitude": 55.213
                    }
                },
                "scenarios": [
                    {
                    "name": "",
                    "criteria": {
                        "weekdays": [ 1, 2 ],
                        "datePeriod": {
                        "from": "2020-09-05T23:32:34+02:00",
                        "to": "2021-10-05T00:32:34+02:00"
                        }
                    },
                    "gates": [
                        {
                        "name": "Gate B",
                        "slots": [
                            {
                            "arrivalTime": "2021-10-05T00:32:34+02:00",
                            "lastDepartureTime": "2021-10-05T08:32:34+02:00",
                            "timeBetweenDepartures": "00:20:00",
                            "vehicleGroupId": ""
                            }
                        ]
                        }
                    ]
                    }
                ]
                }
            ],
            "taskTimes": {
                "base": {
                "initial": 12.132,
                "perFloor": 12.239,
                "perRound": 12.213
                },
                "roundDefinition": {
                "colliPerRound": 12,
                "weightPerRound": 12,
                "volumePerRound": 13
                },
                "scenarios": [
                {
                    "criteria": {
                    "orderTagsAllRequired": [ "" ],
                    "orderTagsOneRequired": [ "" ],
                    },
                    "additionalTime": {
                    "initial": 12.132,
                    "perFloor": 12.239,
                    "perRound": 12.213
                    }
                }
                ]
            },
            "specialAreas": [
                {
                "name": "",
                "color": 1,
                "polygon": [],
                "scenarios": [
                    {
                    "criteria": {
                        "weekdays": [ 1, 2 ],
                        "datePeriod": {
                        "from": "2020-09-05T23:32:34+02:00",
                        "to": "2021-10-05T00:32:34+02:00"
                        },
                        "orderTagsAllRequired": [ "" ],
                        "orderTagsOneRequired": [ "" ]
                    },
                    "rules": {
                        "taskTimeChange": 12,
                        "drivingPercentageChange": 0.12,
                        "isBlocked": false
                    }
                    }
                ]
                }
            ]
        }
    },

    "POST /api/v1/routeplanning/settingsv2/create":
    {
        status: 201
    },

    "POST /api/v1/routeplanning/settingsv2/update":
    {
        status: 201
    },

    "POST /api/v1/routeplanning/settingsv2/delete":
    {
        status: 201
    }
};
