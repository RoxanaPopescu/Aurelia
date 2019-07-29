// tslint:disable

const expressRoutes =
[
    {
        "id": "f0a4c73f-f8ae-494c-a1e6-0051e526f53e",
        "slug": "R6274179423-Split000027",
        "reference": "0910-165A-MV",
        "criticality": "high",
        "vehicleTypeId": "165f348d-ea67-4c94-9b27-48f2be29d545",
        "pickupPostalCode": "2600",
        "deliveryPostalCode": "2600",
        "timeToDeadline": "600",
        "expires": undefined,

        "stops":
        [
            {
                "hidden": false,
                "id": "3c76a098-6a70-4be2-80ed-ffb76692a7c1",
                "status": "not-visited",
                "type": "Pickup",
                "outfit":
                {
                    "contactPerson": "Oliver Kas",
                    "contactPhone":
                    {
                        "countryPrefix": "45",
                        "number": "13123",
                        "formatted": "+45  1 31 23"
                    }
                },
                "location":
                {
                    "address":
                    {
                        "primary": "Ejby Industrivej 38 , 2600  Glostrup"
                    },
                    "position":
                    {
                        "latitude": 55.694707,
                        "longitude": 12.423264
                    }
                },
                "loadingTime": 420.0,
                "arrivalTimeFrame":
                {
                    "from": "2019-03-18T09:00:00+00:00",
                    "to": "2019-03-18T11:00:00+00:00"
                },
                "arrivalTime": "2019-07-16T14:15:40.8220995+00:00",
                "completionTime": "2019-07-16T14:22:40.8220995+00:00",
                "isDelayed": true,
                "estimates":
                {
                    "drivingTime": 1615,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "completionTime": "2019-03-18T09:33:55+00:00"
                }
            },
            {
                "hidden": false,
                "id": "3c76a098-6a70-4be2-80ed-ffb76792a7c4",
                "status": "not-visited",
                "type": "Delivery",
                "outfit":
                {
                    "contactPhone":
                    {
                        "countryPrefix": "45",
                        "number": "53585845",
                        "formatted": "+45 53 58 58 45"
                    }
                },
                "location":
                {
                    "address":
                    {
                        "primary": "Refshalevej 147 , 1432  København K"
                    },
                    "position":
                    {
                        "latitude": 55.6895894,
                        "longitude": 12.6114004
                    }
                },
                "loadingTime": 120.0,
                "arrivalTimeFrame":
                {
                    "from": "2019-03-18T09:00:00+00:00",
                    "to": "2019-03-18T10:45:00+00:00"
                },
                "arrivalTime": "2019-07-16T14:24:50.8846266+00:00",
                "completionTime": "2019-07-16T14:26:50.8846266+00:00",
                "isDelayed": false,
                "estimates":
                {
                    "drivingTime": 130,
                    "loadingTime": 120,
                    "waitingTime": 0,
                    "completionTime": "2019-03-18T09:38:05+00:00"
                }
            }
        ],
    }
];

const driverRoutes =
[
    {
        "status": "on-time",
        "driver":
        {
            "id": 5506,
            "name":
            {
                "first": "Oliver",
                "last": "Kas"
            },
            "phone":
            {
                "countryPrefix": "45",
                "number": "12345678",
                "formatted": "+45 12 34 56 78"
            },
            "pictureUrl": "https://cdn1.thehunt.com/assets/default_avatar-51c8ddf72a3f138adf9443a3be871aa4.png"
        },
        "driverVehicle":
        {
            "id": 1332,
            "licensePlate": "CW62525",
            "vehicleTypeId": "2321cbd7-5bed-4035-a827-2bfea31bb8e8",
            "makeAndModel": "Mike Model",
            "color": "Sort"
        },
        "driverOnline": false,
        "driverPosition":
        {
            "latitude": 55.68221077,
            "longitude": 12.58594925
        },
        "completionTime": "2019-07-16T14:26:50.8846266+00:00",

        "stops":
        [
            {
                "hidden": false,
                "id": "3c76a098-6a70-4be2-80ed-ffb76792a7c4",
                "status": "not-visited",
                "type": "Delivery",
                "outfit":
                {
                    "contactPhone":
                    {
                        "countryPrefix": "45",
                        "number": "53585845",
                        "formatted": "+45 53 58 58 45"
                    }
                },
                "location":
                {
                    "address":
                    {
                        "primary": "Refshalevej 147 , 1432  København K"
                    },
                    "position":
                    {
                        "latitude": 55.6895894,
                        "longitude": 12.6114004
                    }
                },
                "loadingTime": 120.0,
                "arrivalTimeFrame":
                {
                    "from": "2019-03-18T09:00:00+00:00",
                    "to": "2019-03-18T10:45:00+00:00"
                },
                "arrivalTime": "2019-07-16T14:24:50.8846266+00:00",
                "completionTime": "2019-07-16T14:26:50.8846266+00:00",
                "isDelayed": true,
                "estimates":
                {
                    "drivingTime": 130,
                    "loadingTime": 120,
                    "waitingTime": 0,
                    "completionTime": "2019-03-18T09:38:05+00:00"
                }
            },
            {
                "hidden": false,
                "id": "4c76a098-6a70-4be2-80ed-ffb76792a7c4",
                "status": "not-visited",
                "type": "Delivery",
                "outfit":
                {
                    "contactPhone":
                    {
                        "countryPrefix": "45",
                        "number": "53585845",
                        "formatted": "+45 53 58 58 45"
                    }
                },
                "location":
                {
                    "address":
                    {
                        "primary": "Somestreat 123 , 1337  Somecity"
                    },
                    "position":
                    {
                        "latitude": 55.67,
                        "longitude": 12.7
                    }
                },
                "loadingTime": 120.0,
                "arrivalTimeFrame":
                {
                    "from": "2019-03-18T09:00:00+00:00",
                    "to": "2019-03-18T10:45:00+00:00"
                },
                "arrivalTime": "2019-07-16T14:24:50.8846266+00:00",
                "completionTime": "2019-07-16T14:26:50.8846266+00:00",
                "isDelayed": false,
                "estimates":
                {
                    "drivingTime": 130,
                    "loadingTime": 120,
                    "waitingTime": 0,
                    "completionTime": "2019-03-18T09:38:05+00:00"
                }
            },
            {
                "hidden": false,
                "id": "5c76a098-6a70-4be2-80ed-ffb76792a7c4",
                "status": "not-visited",
                "type": "Delivery",
                "outfit":
                {
                    "contactPhone":
                    {
                        "countryPrefix": "45",
                        "number": "53585845",
                        "formatted": "+45 53 58 58 45"
                    }
                },
                "location":
                {
                    "address":
                    {
                        "primary": "Otherstreat 123 , 4242  Othercity"
                    },
                    "position":
                    {
                        "latitude": 55.665,
                        "longitude": 12.85
                    }
                },
                "loadingTime": 120.0,
                "arrivalTimeFrame":
                {
                    "from": "2019-03-18T09:00:00+00:00",
                    "to": "2019-03-18T10:45:00+00:00"
                },
                "arrivalTime": "2019-07-16T14:24:50.8846266+00:00",
                "completionTime": "2019-07-16T14:26:50.8846266+00:00",
                "isDelayed": false,
                "estimates":
                {
                    "drivingTime": 130,
                    "loadingTime": 120,
                    "waitingTime": 0,
                    "completionTime": "2019-03-18T09:38:05+00:00"
                }
            }
        ],
    }
];

export default
    {
        "POST /api/v1/express-routes/get-express-routes":
        {
            data: cloneExpressRoutes([...expressRoutes, ...expressRoutes, ...expressRoutes, ...expressRoutes, ...expressRoutes])
        },

        "POST /api/v1/express-routes/get-driver-routes":
        {
            data: cloneDriverRoutes([...driverRoutes, ...driverRoutes, ...driverRoutes, ...driverRoutes, ...driverRoutes])
        },

        "POST /api/v1/express-routes/estimate-driver-route":
        {
            data: cloneDriverRoutes(driverRoutes)[0]
        },

        "POST /api/v1/express-routes/update-driver-route":
        {
            data: cloneDriverRoutes(driverRoutes)[0]
        }
    }

    function cloneExpressRoutes(routes)
    {
        let i = 0;

        return routes.map(r =>
        {
            const route = JSON.parse(JSON.stringify(r));
            route.id = route.id + i++;

            route.stops[0].location.position.latitude += (0.8 - Math.random()) * 0.1;
            route.stops[0].location.position.longitude += -0.1 + (0.8 - Math.random()) * 0.1;
            route.stops[1].location.position.latitude += (0.8 - Math.random()) * 0.1;
            route.stops[1].location.position.longitude += -0.15 + (0.8 - Math.random()) * 0.1;

            return route;
        });
    }

    function cloneDriverRoutes(routes)
    {
        let i = 0;

        const result: any[] = [];

        result.push(...routes.map(r =>
        {
            const route = JSON.parse(JSON.stringify(r));
            route.driver.id = route.driver.id + i++;

            route.stops[0].location.position.latitude += (0.8 - Math.random()) * 0.1;
            route.stops[0].location.position.longitude += -0.35 + (0.8 - Math.random()) * 0.2;
            route.stops[1].location.position.latitude += (0.8 - Math.random()) * 0.1;
            route.stops[1].location.position.longitude += -0.35 + (0.8 - Math.random()) * 0.2;
            route.stops[2].location.position.latitude += (0.8 - Math.random()) * 0.1;
            route.stops[2].location.position.longitude += -0.35 + (0.8 - Math.random()) * 0.1;
            route.driverPosition.latitude = route.stops[0].location.position.latitude + (1 - Math.random()) * 0.02;
            route.driverPosition.longitude = -0.05 + route.stops[0].location.position.longitude + (1 - Math.random()) * 0.02;

            return route;
        }));

        result.push(...routes.map(r =>
        {
            const route = JSON.parse(JSON.stringify(r));
            route.driver.id = route.driver.id + routes.length + i++;

            route.stops = [];
            route.completionTime = undefined;
            route.driverPosition.latitude = route.driverPosition.latitude + (1 - Math.random()) * 0.1;
            route.driverPosition.longitude = -0.2 + route.driverPosition.longitude + (1 - Math.random()) * 0.2;

            return route;
        }));

        return result;
    }
