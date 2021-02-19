// tslint:disable
export default
{
    "GET /api/v1/orders/events?slug=22935":
    {
        delay: 1000,
        body:
        [
            {
                id: "order-event-4c-id",
                eventType: "OrderDeliveryEtaProvided",
                data:
                {
                    timeOfEvent: "2020-08-24T16:00:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Vallensbækvej 51",
                            secondary: "2605 Brøndby"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact:
                    {
                        preferredName: "Jane",
                        fullName: "Jane Doe",
                        phone:
                        {
                            nationalNumber: "22334455",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "janedoe@example.com",
                        companyName: "Foo A/S"
                    },
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo: undefined,
                    deviation: undefined,
                    signature: undefined,
                    photo: undefined,
                    actionBy: undefined
                }
            },
            {
                id: "order-event-4b-id",
                subject: "https://",
                eventType: "OrderDeliveryFailed",
                eventTime: "2020-08-24T16:00:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T16:00:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Vallensbækvej 51",
                            secondary: "2605 Brøndby"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact:
                    {
                        preferredName: "Jane",
                        fullName: "Jane Doe",
                        phone:
                        {
                            nationalNumber: "22334455",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "janedoe@example.com",
                        companyName: "Foo A/S"
                    },
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo: undefined,
                    deviation:
                    {
                        name: "Missing colli",
                        description: "Delivery refused due to missing colli"
                    },
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-4a-id",
                subject: "https://",
                eventType: "OrderDeliveryCompleted",
                eventTime: "2020-08-24T16:00:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T16:00:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Vallensbækvej 51",
                            secondary: "2605 Brøndby"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact:
                    {
                        preferredName: "Jane",
                        fullName: "Jane Doe",
                        phone:
                        {
                            nationalNumber: "22334455",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "janedoe@example.com",
                        companyName: "Foo A/S"
                    },
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo: undefined,
                    deviation: undefined,
                    signature:
                    {
                        date: "2020-08-23T18:03:07+01:00",
                        name: "Jane Doe",
                        imageUrl: "https://via.placeholder.com/800x600"

                    },
                    photo:
                    {
                        date: "2020-08-23T18:03:07+01:00",
                        imageUrl: "https://via.placeholder.com/800x600"

                    },
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-3-3-id",
                subject: "https://",
                eventType: "ColloLeftStorage",
                eventTime: "2020-08-24T15:06:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T15:06:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Some Street 42",
                            secondary: "1100 København"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact: undefined,
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo:
                    {
                        id: "collo-3-id",
                        barcode: "345678912",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ]
                    },
                    deviation: undefined,
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-3-2-id",
                subject: "https://",
                eventType: "ColloLeftStorage",
                eventTime: "2020-08-24T15:05:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T15:05:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Some Street 42",
                            secondary: "1100 København"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact: undefined,
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo:
                    {
                        id: "collo-3-id",
                        barcode: "345678912",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ]
                    },
                    deviation: undefined,
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-3-1-id",
                subject: "https://",
                eventType: "ColloLeftStorage",
                eventTime: "2020-08-24T15:04:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T15:04:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Some Street 42",
                            secondary: "1100 København"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact: undefined,
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo:
                    {
                        id: "collo-3-id",
                        barcode: "345678912",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ]
                    },
                    deviation: undefined,
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-3-3-id",
                subject: "https://",
                eventType: "ColloEnteredeStorage",
                eventTime: "2020-08-24T15:03:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T15:03:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Some Street 42",
                            secondary: "1100 København"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact: undefined,
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo:
                    {
                        id: "collo-3-id",
                        barcode: "345678912",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ]
                    },
                    deviation: undefined,
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-3-2-id",
                subject: "https://",
                eventType: "ColloEnteredeStorage",
                eventTime: "2020-08-24T15:02:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T15:02:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Some Street 42",
                            secondary: "1100 København"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact: undefined,
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo:
                    {
                        id: "collo-3-id",
                        barcode: "345678912",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ]
                    },
                    deviation: undefined,
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-3-1-id",
                subject: "https://",
                eventType: "ColloEnteredeStorage",
                eventTime: "2020-08-24T15:01:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T15:01:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Some Street 42",
                            secondary: "1100 København"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact: undefined,
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    collo:
                    {
                        id: "collo-3-id",
                        barcode: "345678912",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ]
                    },
                    deviation: undefined,
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-2-id",
                subject: "https://",
                eventType: "OrderPickupCompleted",
                eventTime: "2020-08-24T14:42:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-24T14:42:00+01:00",
                    location:
                    {
                        address:
                        {
                            primary: "Borupvang 2",
                            secondary: "3450 Allerød"
                        },
                        position:
                        {
                            latitude: 12.123,
                            longitude: 11.333
                        },
                        timeZone: "Europe/Copenhagen"
                    },
                    route:
                    {
                        id: "route-1-id",
                        reference: "0940-01F-MV",
                        slug: "R11189801755",
                        tags:
                        [
                            "tag-1",
                            "tag-2",
                            "tag-3"
                        ],
                        executors:
                        [
                            "executor-1-id",
                            "executor-2-id"
                        ]
                    },
                    contact:
                    {
                        preferredName: "Jane",
                        fullName: "Jane Doe",
                        phone:
                        {
                            nationalNumber: "22334455",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "janedoe@example.com",
                        companyName: "Foo A/S"
                    },
                    driver:
                    {
                        id: "driver-1-id",
                        preferredname: "John",
                        fullName: "John Doe",
                        phone:
                        {
                            nationalNumber: "33445566",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "johndoe@example.com",
                        executor:
                        {
                            id: "executor-1-id",
                            name: "Mover"
                        }
                    },
                    deviation:
                    {
                        name: "Missing colli",
                        description: "Some of the colli were not ready for pickup",
                        imageUrls:
                        [
                            "https://via.placeholder.com/800x600",
                            "https://via.placeholder.com/800x600",
                            "https://via.placeholder.com/800x600"
                        ]
                    },
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user:
                        {
                            id: "user-1-id",
                            preferredName: "John",
                            fullName: "John Doe",
                            imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
                            roleName: "Driver"
                        },
                        organization:
                        {
                            id: "organization-2-id",
                            name: "Mover"
                        }
                    }
                }
            },
            {
                id: "order-event-1-id",
                subject: "https://",
                eventType: "OrderCreated",
                eventTime: "2020-08-23T09:37:10+01:00",
                dataVersion: "1.0",
                data:
                {
                    timeOfEvent: "2020-08-23T09:37:00+01:00",
                    location: undefined,
                    route: undefined,
                    contact:
                    {
                        preferredName: "Jane",
                        fullName: "Jane Doe",
                        phone:
                        {
                            nationalNumber: "22334455",
                            countryCallingCode: "45",
                            countryCode: "DK"
                        },
                        email: "janedoe@example.com",
                        companyName: "Foo A/S"
                    },
                    driver: undefined,
                    deviation: undefined,
                    signature: undefined,
                    photo: undefined,
                    actionBy:
                    {
                        user: undefined,
                        organization:
                        {
                            id: "organization-1-id",
                            name: "Coop"
                        },
                        role: undefined
                    }
                }
            }
        ]
    }
}
