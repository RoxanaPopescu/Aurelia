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
                    "from": "2019-03-18T09:00:00+00:00"
                },
                "arrivalTime": "2019-07-16T14:15:40.8220995+00:00",
                "completionTime": "2019-07-16T14:22:40.8220995+00:00",
                "isDelayed": false,
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
                        "primary": "Erhvervsvej 4 , 2600  Glostrup"
                    },
                    "position":
                    {
                        "latitude": 55.697408,
                        "longitude": 12.424408
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
                    "from": "2019-03-18T09:00:00+00:00"
                },
                "arrivalTime": "2019-07-16T14:15:40.8220995+00:00",
                "completionTime": "2019-07-16T14:22:40.8220995+00:00",
                "isDelayed": false,
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
                        "primary": "Erhvervsvej 4 , 2600  Glostrup"
                    },
                    "position":
                    {
                        "latitude": 55.697408,
                        "longitude": 12.424408
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
            }
        ],
    }
];

export default
    {
        "POST /api/v1/express-routes/get-express-routes":
        {
            data: [...expressRoutes, ...expressRoutes, ...expressRoutes, ...expressRoutes, ...expressRoutes]
        },

        "POST /api/v1/express-routes/get-driver-routes":
        {
            data: [...driverRoutes, ...driverRoutes, ...driverRoutes, ...driverRoutes, ...driverRoutes]
        },

        "POST /api/v1/express-routes/estimate-driver-route":
        {
            data: driverRoutes[0]
        },

        "POST /api/v1/express-routes/update-driver-route":
        {
            data: driverRoutes[0]
        }
    }
