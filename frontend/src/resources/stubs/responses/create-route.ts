// tslint:disable
export default
{
    "POST /api/v1/routes/create":
    {
        delay: 1000,
        // status: 204,
        data:
        {
            "id": "8e012c07-53e8-4f4a-8e8b-a74667d50b34",
            "slug": "M567-12",
            "tags": [
                "7days",
                "citytruck"
            ],
            "productType": "Solution",
            "status": "requested",
            "estimates": {
                "drivingTime": 1415,
                "loadingTime": 600,
                "waitingTime": 600,
                "taskTime": 600,
                "completionTime": "2020-04-16T18:19:35+00:00",
                "arrivalTime": "2020-04-16T18:09:35+00:00"
            },
            "reference": "IK-2-012-D",
            "driverListUrl": "https://www.mover.systems/pdf/customers/trip-overview/?requestId=512858&token=C02418D5",
            "vehicleType": "49e89607-3117-48d0-86e0-225b36630c43",
            "criticality": "low",
            "driverOnline": false,
            "plannedTimeFrame": {
                "from": "2020-04-16T15:00:00+00:00",
                "to": "2020-04-16T18:09:33+00:00"
            },
            "fulfiller": {
                "type": "Fulfiller",
                "id": "a277d710-1c2b-4037-b288-5ae5b5221641",
                "publicId": "bring",
                "companyName": "Bring",
                "contactPerson": "Bring",
                "contactEmail": "bring@mover.dk",
                "address": "",
                "contactPhone": {
                "number": "",
                "countryPrefix": null
                }
            },
            "stops": [
                {
                "hidden": false,
                "id": "1267890",
                "status": "not-visited",
                "type": "Pickup",
                "actions": {
                    "instructionsAccept": false,
                    "signature": false,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "scanAllColli": false,
                    "scanColli": true,
                    "photo": false,
                    "verificationCode": false
                },
                "problems": [],
                "selfies": [],
                "orderIds": [
                    "CJ580614940NO",
                    "CJ580615389NO",
                    "CJ580615579NO"
                ],
                "outfit": {},
                "location": {
                    "address": {
                    "primary": "Gammelager 13, 2605 Brøndby"
                    },
                    "position": {
                    "latitude": 55.6485633,
                    "longitude": 12.3818585
                    },
                    "timeZone": "Europe/Copenhagen"
                },
                "arrivalTimeFrame": {
                    "from": "2020-04-16T15:00:00+00:00",
                    "to": "2020-04-16T15:00:00+00:00"
                },
                "isDelayed": false,
                "signatureRequired": false,
                "photoRequired": false,
                "estimates": {
                    "drivingTime": 0,
                    "loadingTime": 2700,
                    "waitingTime": 0,
                    "taskTime": 2700,
                    "completionTime": "2020-04-16T15:45:00+00:00",
                    "arrivalTime": "2020-04-16T15:00:00+00:00"
                },
                "pickups": [
                    {
                    "orderId": "8bf84c41-06bc-c0c3-3e13-5418b6a48df2",
                    "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                    "consignorOrderId": "CJ580614940NO",
                    "orderSlug": "CJ580614940NO",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": [
                        {
                        "id": "563461",
                        "barcode": "CJ580614940NO",
                        "status": "no-action",
                        "origin": "regular",
                        "orderId": "8bf84c41-06bc-c0c3-3e13-5418b6a48df2",
                        "colloId": "6b5aab3c-848e-41a9-ae47-48ca70bf6e6f",
                        "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                        "consignorOrderId": "CJ580614940NO"
                        }
                    ]
                    },
                    {
                    "orderId": "61c88a16-f695-f876-26c2-f387c9c56bd4",
                    "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                    "consignorOrderId": "CJ580615579NO",
                    "orderSlug": "CJ580615579NO",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": [
                        {
                        "id": "563489",
                        "barcode": "CJ580615579NO",
                        "status": "no-action",
                        "origin": "regular",
                        "orderId": "61c88a16-f695-f876-26c2-f387c9c56bd4",
                        "colloId": "11006678-9695-4ce9-b542-3a8348161a12",
                        "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                        "consignorOrderId": "CJ580615579NO"
                        }
                    ]
                    },
                    {
                    "orderId": "c95dbe1e-d4f1-8819-d5f4-4c723d7948a5",
                    "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                    "consignorOrderId": "CJ580615389NO",
                    "orderSlug": "CJ580615389NO",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": [
                        {
                        "id": "563488",
                        "barcode": "CJ580615389NO",
                        "status": "no-action",
                        "origin": "regular",
                        "orderId": "c95dbe1e-d4f1-8819-d5f4-4c723d7948a5",
                        "colloId": "c068c4c6-bed5-414d-8aa3-f7655789d639",
                        "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                        "consignorOrderId": "CJ580615389NO"
                        }
                    ]
                    }
                ],
                "deliveries": []
                },
                {
                "hidden": false,
                "id": "1267891",
                "driverInstructions": "Levering til kantsten. ",
                "reference": "CJ580614940NO",
                "tags": [
                    "7days",
                    "1man",
                    "Curbside",
                    "Regular",
                    "LCD_ZONE_A_CURBSIDE_DELIVERY_FUTURE",
                    "Outbound",
                    "L591"
                ],
                "status": "not-visited",
                "type": "Delivery",
                "actions": {
                    "instructionsAccept": false,
                    "signature": true,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "scanAllColli": false,
                    "scanColli": true,
                    "photo": false,
                    "verificationCode": false
                },
                "problems": [],
                "selfies": [],
                "orderIds": [
                    "CJ580614940NO"
                ],
                "outfit": {
                    "contactPerson": "Anonymous",
                    "contactPhone": {
                    "countryPrefix": "45",
                    "number": "1234567",
                    "formatted": "+45 1 23 45 67"
                    }
                },
                "location": {
                    "address": {
                    "primary": "Bispebjerg Bakke 1, 2. 202, 2400 København NV, DK, "
                    },
                    "position": {
                    "latitude": 55.710791,
                    "longitude": 12.538001
                    },
                    "timeZone": "Europe/Copenhagen"
                },
                "arrivalTimeFrame": {
                    "from": "2020-04-16T13:00:00+00:00",
                    "to": "2020-04-16T19:00:00+00:00"
                },
                "isDelayed": false,
                "signatureRequired": true,
                "photoRequired": false,
                "estimates": {
                    "drivingTime": 1282,
                    "loadingTime": 690,
                    "waitingTime": 0,
                    "taskTime": 690,
                    "completionTime": "2020-04-16T16:17:52+00:00",
                    "arrivalTime": "2020-04-16T16:06:22+00:00"
                },
                "pickups": [],
                "deliveries": [
                    {
                    "orderId": "8bf84c41-06bc-c0c3-3e13-5418b6a48df2",
                    "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                    "consignorOrderId": "CJ580614940NO",
                    "orderSlug": "CJ580614940NO",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": [
                        {
                        "id": "563461",
                        "barcode": "CJ580614940NO",
                        "status": "no-action",
                        "origin": "regular",
                        "orderId": "8bf84c41-06bc-c0c3-3e13-5418b6a48df2",
                        "colloId": "6b5aab3c-848e-41a9-ae47-48ca70bf6e6f",
                        "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                        "consignorOrderId": "CJ580614940NO"
                        }
                    ]
                    }
                ]
                },
                {
                "hidden": false,
                "id": "1267892",
                "driverInstructions": "Levering til kantsten. ",
                "reference": "CJ580611926NO",
                "tags": [
                    "Outbound",
                    "LCD_ZONE_A_CURBSIDE_DELIVERY_FUTURE",
                    "Regular",
                    "Curbside",
                    "1man",
                    "7days",
                    "L591"
                ],
                "status": "not-visited",
                "type": "Delivery",
                "actions": {
                    "instructionsAccept": false,
                    "signature": true,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "scanAllColli": false,
                    "scanColli": true,
                    "photo": false,
                    "verificationCode": false
                },
                "problems": [],
                "selfies": [],
                "orderIds": [
                    "CJ580611926NO"
                ],
                "outfit": {
                    "contactPerson": "Anonymous",
                    "contactPhone": {
                    "countryPrefix": "45",
                    "number": "1234567",
                    "formatted": "+45 1 23 45 67"
                    }
                },
                "location": {
                    "address": {
                    "primary": "gyngemose parkvej 44, 2 tv, 2860 Søborg, DK, "
                    },
                    "position": {
                    "latitude": 55.725373,
                    "longitude": 12.4755987
                    },
                    "timeZone": "Europe/Copenhagen"
                },
                "arrivalTimeFrame": {
                    "from": "2020-04-16T13:00:00+00:00",
                    "to": "2020-04-16T19:00:00+00:00"
                },
                "isDelayed": false,
                "signatureRequired": true,
                "photoRequired": false,
                "estimates": {
                    "drivingTime": 549,
                    "loadingTime": 660,
                    "waitingTime": 0,
                    "taskTime": 660,
                    "completionTime": "2020-04-16T16:38:01+00:00",
                    "arrivalTime": "2020-04-16T16:27:01+00:00"
                },
                "pickups": [],
                "deliveries": [
                    {
                    "orderId": "e4005458-e75a-b0c0-07a6-1a902d9da8db",
                    "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                    "consignorOrderId": "CJ580611926NO",
                    "orderSlug": "CJ580611926NO",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": []
                    }
                ]
                },
                {
                "hidden": false,
                "id": "1267893",
                "driverInstructions": "Levering til kantsten. ",
                "reference": "CJ580612348NO",
                "tags": [
                    "1man",
                    "Curbside",
                    "Regular",
                    "LCD_ZONE_A_CURBSIDE_DELIVERY_FUTURE",
                    "Outbound",
                    "L591",
                    "7days"
                ],
                "status": "not-visited",
                "type": "Delivery",
                "actions": {
                    "instructionsAccept": false,
                    "signature": true,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "scanAllColli": false,
                    "scanColli": true,
                    "photo": false,
                    "verificationCode": false
                },
                "problems": [],
                "selfies": [],
                "orderIds": [
                    "CJ580612348NO"
                ],
                "outfit": {
                    "contactPerson": "Anonymous",
                    "contactPhone": {
                    "countryPrefix": "45",
                    "number": "1234567",
                    "formatted": "+45 1 23 45 67"
                    }
                },
                "location": {
                    "address": {
                    "primary": "Bagsværd Hovedgade 116A 7E, 2880 Bagsværd, DK, "
                    },
                    "position": {
                    "latitude": 55.760906,
                    "longitude": 12.455762
                    },
                    "timeZone": "Europe/Copenhagen"
                },
                "arrivalTimeFrame": {
                    "from": "2020-04-16T13:00:00+00:00",
                    "to": "2020-04-16T19:00:00+00:00"
                },
                "isDelayed": false,
                "signatureRequired": true,
                "photoRequired": false,
                "estimates": {
                    "drivingTime": 474,
                    "loadingTime": 720,
                    "waitingTime": 0,
                    "taskTime": 720,
                    "completionTime": "2020-04-16T16:57:55+00:00",
                    "arrivalTime": "2020-04-16T16:45:55+00:00"
                },
                "pickups": [],
                "deliveries": [
                    {
                    "orderId": "a7972df8-81d7-65d9-8036-1f7ac1619598",
                    "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                    "consignorOrderId": "CJ580612348NO",
                    "orderSlug": "CJ580612348NO",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": []
                    }
                ]
                },
                {
                "hidden": false,
                "id": "1267894",
                "driverInstructions": "Levering til kantsten. ",
                "reference": "CJ580615579NO",
                "tags": [
                    "7days",
                    "1man",
                    "Curbside",
                    "Regular",
                    "LCD_ZONE_A_CURBSIDE_DELIVERY_FUTURE",
                    "Outbound",
                    "L591"
                ],
                "status": "not-visited",
                "type": "Delivery",
                "actions": {
                    "instructionsAccept": false,
                    "signature": true,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "scanAllColli": false,
                    "scanColli": true,
                    "photo": false,
                    "verificationCode": false
                },
                "problems": [],
                "selfies": [],
                "orderIds": [
                    "CJ580615579NO"
                ],
                "outfit": {
                    "contactPerson": "Anonymous",
                    "contactPhone": {
                    "countryPrefix": "45",
                    "number": "1234567",
                    "formatted": "+45 1 23 45 67"
                    }
                },
                "location": {
                    "address": {
                    "primary": "Solhøjpark 10, 3520 Farum, DK, "
                    },
                    "position": {
                    "latitude": 55.8182142,
                    "longitude": 12.3978695
                    },
                    "timeZone": "Europe/Copenhagen"
                },
                "arrivalTimeFrame": {
                    "from": "2020-04-16T13:00:00+00:00",
                    "to": "2020-04-16T19:00:00+00:00"
                },
                "isDelayed": false,
                "signatureRequired": true,
                "photoRequired": false,
                "estimates": {
                    "drivingTime": 565,
                    "loadingTime": 750,
                    "waitingTime": 0,
                    "taskTime": 750,
                    "completionTime": "2020-04-16T17:19:50+00:00",
                    "arrivalTime": "2020-04-16T17:07:20+00:00"
                },
                "pickups": [],
                "deliveries": [
                    {
                    "orderId": "61c88a16-f695-f876-26c2-f387c9c56bd4",
                    "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                    "consignorOrderId": "CJ580615579NO",
                    "orderSlug": "CJ580615579NO",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": [
                        {
                        "id": "563489",
                        "barcode": "CJ580615579NO",
                        "status": "no-action",
                        "origin": "regular",
                        "orderId": "61c88a16-f695-f876-26c2-f387c9c56bd4",
                        "colloId": "11006678-9695-4ce9-b542-3a8348161a12",
                        "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                        "consignorOrderId": "CJ580615579NO"
                        }
                    ]
                    }
                ]
                },
                {
                "hidden": false,
                "id": "1267895",
                "driverInstructions": "Levering til kantsten. ",
                "reference": "CJ580615389NO",
                "tags": [
                    "7days",
                    "1man",
                    "Curbside",
                    "Regular",
                    "LCD_ZONE_A_CURBSIDE_DELIVERY_FUTURE",
                    "Outbound",
                    "L591"
                ],
                "status": "not-visited",
                "type": "Delivery",
                "actions": {
                    "instructionsAccept": false,
                    "signature": true,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "scanAllColli": false,
                    "scanColli": true,
                    "photo": false,
                    "verificationCode": false
                },
                "problems": [],
                "selfies": [],
                "orderIds": [
                    "CJ580615389NO"
                ],
                "outfit": {
                    "contactPerson": "Anonymous",
                    "contactPhone": {
                    "countryPrefix": "45",
                    "number": "1234567",
                    "formatted": "+45 1 23 45 67"
                    }
                },
                "location": {
                    "address": {
                    "primary": "Lærkehaven 37, 3500 Værløse, DK, "
                    },
                    "position": {
                    "latitude": 55.787229,
                    "longitude": 12.3415311
                    },
                    "timeZone": "Europe/Copenhagen"
                },
                "arrivalTimeFrame": {
                    "from": "2020-04-16T13:00:00+00:00",
                    "to": "2020-04-16T19:00:00+00:00"
                },
                "isDelayed": false,
                "signatureRequired": true,
                "photoRequired": false,
                "estimates": {
                    "drivingTime": 700,
                    "loadingTime": 870,
                    "waitingTime": 0,
                    "taskTime": 870,
                    "completionTime": "2020-04-16T17:46:00+00:00",
                    "arrivalTime": "2020-04-16T17:31:30+00:00"
                },
                "pickups": [],
                "deliveries": [
                    {
                    "orderId": "c95dbe1e-d4f1-8819-d5f4-4c723d7948a5",
                    "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                    "consignorOrderId": "CJ580615389NO",
                    "orderSlug": "CJ580615389NO",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": [
                        {
                        "id": "563488",
                        "barcode": "CJ580615389NO",
                        "status": "no-action",
                        "origin": "regular",
                        "orderId": "c95dbe1e-d4f1-8819-d5f4-4c723d7948a5",
                        "colloId": "c068c4c6-bed5-414d-8aa3-f7655789d639",
                        "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                        "consignorOrderId": "CJ580615389NO"
                        }
                    ]
                    }
                ]
                },
                {
                "hidden": false,
                "id": "1267896",
                "status": "not-visited",
                "type": "Delivery",
                "actions": {
                    "instructionsAccept": false,
                    "signature": true,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "scanAllColli": false,
                    "scanColli": false,
                    "photo": false,
                    "verificationCode": false
                },
                "problems": [],
                "selfies": [],
                "orderIds": [],
                "outfit": {},
                "location": {
                    "address": {
                    "primary": "Gammelager 13, 2605 Brøndby"
                    },
                    "position": {
                    "latitude": 55.64912862,
                    "longitude": 12.38167117
                    },
                    "timeZone": "Europe/Copenhagen"
                },
                "arrivalTimeFrame": {
                    "from": "2020-04-16T18:09:33+00:00",
                    "to": "2020-04-16T18:09:33+00:00"
                },
                "isDelayed": true,
                "signatureRequired": true,
                "photoRequired": false,
                "estimates": {
                    "drivingTime": 1415,
                    "loadingTime": 600,
                    "waitingTime": 0,
                    "taskTime": 600,
                    "completionTime": "2020-04-16T18:19:35+00:00",
                    "arrivalTime": "2020-04-16T18:09:35+00:00"
                },
                "pickups": [],
                "deliveries": [
                    {
                    "orderId": "f383f486-27cc-49c5-bc29-a21e644fa066",
                    "consignorId": "94949778-0d51-4db7-bac4-59510175277a",
                    "consignee": {
                        "companyName": "Coop Log Test",
                        "contactPhone": {
                        "countryPrefix": "45",
                        "number": "11249023901",
                        "formatted": "+45    "
                        }
                    },
                    "colli": []
                    }
                ]
                }
            ],
            "vehicleTypeId": "49e89607-3117-48d0-86e0-225b36630c43",
            "allowAssignment": true
        }
    }
}
