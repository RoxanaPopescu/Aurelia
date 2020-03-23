export default
{
    "POST /api/v1/routeplanning/rulesets/details":
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
            "id": "960a7f5a-c4aa-4eef-9e73-c057e913f8f2",
            "name": "Settings name 5",
            "slug": "settings-name-5",
            "restrictions":
            {
                "ferriesAllowed": false,
                "privateRoadsAllowed": true,
                "uturnStrategy": "allowed",
                "curbApproachStrategy": "either-side-of-vehicle",
                "oneRoutePlanPerStartLocation": false,
                "timeWindowAdjustment":
                {
                    "start": 300,
                    "end": 600
                },
                "maxCalculationTime": 3600
            },
            "routeCreation":
            {
                "routeTags":
                [
                    "tag-1",
                    "tag-2"
                ],
                "manualApproval": false,
                "routeNameTemplate": "IK-{AreaRouteNumber}-{Weekday}-{RouteplanRouteNumber}-{StartTime}"
            },
            "vehicleGroups":
            [
                {
                    "name": "Electric Van",
                    "id": "fe6c46c9-7277-4890-92b2-e009821de944",
                    "cost":
                    {
                        "newRoute": 120,
                        "waitingTime": 8,
                        "drivingTime": 5,
                        "taskTime": 5,
                        "distance": 2
                    },
                    "vehicleTypeId": "2321cbd7-5bed-4035-a827-2bfea31bb8e8",
                    "limits":
                    {
                        "volume": 100,
                        "weight": 900,
                        "colliCount": 1000,
                        "stopCount": 30,
                        "time": 43200,
                        "distance": 300
                    },
                    "orderTagsOneRequired":
                    [
                        "electric",
                        "eco"
                    ],
                    "endLocation":
                    {
                        "location":
                        {
                            "address":
                            {
                                "primary": "Mårkærvej 15",
                                "secondary": "2630 Taastrup"
                            },
                            "position":
                            [
                                10.2948912,
                                55.7815602
                            ]
                        },
                        "time": 600
                    },
                    "routeTags":
                    [
                        "electric"
                    ]
                }
            ],
            "departureTimes":
            [
                {
                    "startLocation":
                    {
                        "address":
                        {
                            "primary": "Mårkærvej 15",
                            "secondary": "2630 Taastrup"
                        },
                        "position":
                        [
                            10.2948912,
                            55.7815602
                        ]
                    },
                    "scenarios":
                    [
                        {
                            "gates":
                            [
                                {
                                    "name": "Gate B",
                                    "slots":
                                    [
                                        {
                                            "earliestArrivalTime": 23700,
                                            "latestDepartureTime": 30120,
                                            "vehicleGroup": "3462b6c3-1b44-4015-b971-98070d8f216c",
                                            "timeBetweenDepartures": 1320
                                        }
                                    ]
                                }
                            ],
                            "name": "Weekdays - no monday",
                            "criteria":
                            {
                                "weekdays":
                                [
                                    2,
                                    3,
                                    4,
                                    5
                                ],
                                "datePeriod":
                                {
                                    "from": "2021-01-19T23:00:00+01:00",
                                    "to": "2021-12-19T23:00:00+01:00"
                                }
                            }
                        }
                    ]
                }
            ],
            "taskTimes":
            {
                "base":
                {
                    "initial": 300,
                    "perFloor": 30,
                    "perRound": 30
                },
                "roundDefinition":
                {
                    "colliPerRound": 5,
                    "weightPerRound": 30,
                    "volumePerRound": 0.7
                },
                "scenarios":
                [
                    {
                        "criteria":
                        {
                            "orderTagsAllRequired":
                            [
                                "tag-1",
                                "tag-2"
                            ],
                            "orderTagsOneRequired":
                            [
                                "tag-3",
                                "tag-4"
                            ]
                        },
                        "time":
                        {
                            "initial": 300,
                            "perFloor": 30,
                            "perRound": 30
                        }
                    }
                ]
            },
            "specialAreas":
            [
                {
                    "polygon":
                    {
                        "type": "Polygon",
                        "coordinates":
                        [
                            [
                                [
                                    12.502155,
                                    55.711982
                                ],
                                [
                                    12.542227,
                                    55.713366
                                ],
                                [
                                    12.491405,
                                    55.70604
                                ],
                                [
                                    12.502155,
                                    55.711982
                                ]
                            ]
                        ]
                    },
                    "name": "Jylland",
                    "color": 2,
                    "scenarios":
                    [
                        {
                            "criteria":
                            {
                                "weekdays":
                                [
                                    6,
                                    1
                                ],
                                "datePeriod":
                                {
                                    "from": "2021-01-19T23:00:00+01:00",
                                    "to": "2021-12-19T23:00:00+01:00"
                                },
                                "orderTagsAllRequired": [],
                                "orderTagsOneRequired":
                                [
                                    "tag-1"
                                ]
                            },
                            "taskTimeChange": 300,
                            "drivingTimeChangeFactor": -0.12,
                            "isAreaBlocked": false
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
