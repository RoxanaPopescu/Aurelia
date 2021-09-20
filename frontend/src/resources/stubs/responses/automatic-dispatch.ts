// tslint:disable
export default
{
    "GET /api/v2/automatic-dispatch/jobs/2d1ce873-50d3-45ea-b6b4-891fa4ca79f1":
    {
      delay: 2000,
      body:
      {
        "id": "88369316-8873-4b7b-b740-7dcf9782b9dd",
        "name": "anja@moverlogistik.dk - 2021-09-15T09:47:38.192+00:00",
        "status": "succeeded",
        "created": "2021-09-15T09:47:38.293079+00:00",
        "result": {
          "routes": [
            {
              "id": "1da7c570-ba26-11eb-8d23-6197e17bcfed",
              "slug": "M637571926436082129",
              "legacyId": "13353",
              "supportNote": "",
              "complexity": 0,
              "tags": ["ManualRoute", "CollectionPoint"],
              "productType": "Solution",
              "status": "InProgress",
              "estimates": {
                "drivingTime": 6100,
                "loadingTime": 420,
                "waitingTime": 3474,
                "taskTime": 420,
                "completionTime": "2021-08-18T19:02:29+00:00",
                "arrivalTime": "2021-08-18T18:04:35+00:00",
                "distance": 205780
              },
              "reference": "123",
              "driverListUrl": "https://noi.mover.dev/pdf/customers/trip-overview/?sessionId=13353&token=8F96629C",
              "owner": {
                "companyName": "IKEA",
                "legacyId": "11425",
                "contactEmail": "ikea@mover.dk",
                "contactPhone": {
                  "countryCallingCode": "45",
                  "nationalNumber": "52332355",
                  "countryPrefix": "45",
                  "number": "52332355"
                }
              },
              "vehicleType": "2321cbd7-5bed-4035-a827-2bfea31bb8e8",
              "criticality": "High",
              "driver": {
                "id": 11823,
                "name": { "first": "Ruster", "last": "Test" },
                "device": { "os": "AndroidDriver", "appVersion": "2.17.3" },
                "phone": {
                  "countryCallingCode": "45",
                  "nationalNumber": "42342342",
                  "countryPrefix": "45",
                  "number": "42342342"
                },
                "pictureUrl": "https://mover-storage.s3-eu-west-1.amazonaws.com/static/avatar.png",
                "email": "test2@mover.dk",
                "status": "approved"
              },
              "vehicle": {
                "id": "1589",
                "name": "Varevogn",
                "status": "Approved",
                "licensePlate": "TE123456",
                "make": "TESTESEN",
                "model": "TEST",
                "productionYear": 2020,
                "color": "HVID",
                "approvedTotalWeight": 900,
                "internalDimensions": { "width": 1.5, "height": 1.5, "length": 3 },
                "type": "2321cbd7-5bed-4035-a827-2bfea31bb8e8",
                "makeAndModel": "TESTESEN TEST",
                "vehicleTypeId": "2321cbd7-5bed-4035-a827-2bfea31bb8e8"
              },
              "executorIds": [
                "bf6d4bf2-49a2-44e7-9c49-489405c5776d",
                "2ab2712b-5f60-4439-80a9-a58379cce885"
              ],
              "driverOnline": false,
              "isPrimaryFulfiller": true,
              "driverPosition": {
                "latitude": 55.6620569,
                "longitude": 12.5777355,
                "timestamp": "2021-05-25T13:05:43+00:00"
              },
              "plannedTimeFrame": {
                "from": "2021-08-18T13:15:00+00:00",
                "to": "2021-08-18T13:00:00+00:00"
              },
              "fulfiller": {
                "id": "2ab2712b-5f60-4439-80a9-a58379cce885",
                "publicId": "MoverLogistics",
                "companyName": "Mover Logistics",
                "contactPerson": "Operations",
                "contactEmail": "support@mover.dk"
              },
              "stops": [
                {
                  "hidden": false,
                  "id": "1422017",
                  "reference": "547778534",
                  "tags": [
                    "IntegrationV2",
                    "CC",
                    "ClickAndCollect",
                    "1man",
                    "Curbside",
                    "CollectionPoint",
                    "SGR60000851",
                    "Outbound",
                    "L068",
                    "CC4800",
                    "Mainland",
                    "1189084176"
                  ],
                  "status": "Completed",
                  "type": "Pickup",
                  "actions": {
                    "instructionsAccept": false,
                    "signature": false,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "handleAllColli": false,
                    "scanColli": false,
                    "photo": false,
                    "identity": false,
                    "verificationCode": false
                  },
                  "deviations": [],
                  "selfies": [],
                  "orderIds": ["547778534"],
                  "outfit": {
                    "legacyId": "11425",
                    "contactPerson": "Name Removed",
                    "contactPhone": {
                      "countryCode": "DK",
                      "countryCallingCode": "45",
                      "nationalNumber": "12345678",
                      "countryPrefix": "DK",
                      "number": "12345678"
                    }
                  },
                  "location": {
                    "address": { "primary": "Gammelager 13, 2605 BRØNDBY, DK" },
                    "position": { "latitude": 55.6485633, "longitude": 12.3818585 },
                    "timeZone": "Europe/Copenhagen"
                  },
                  "arrivalTimeFrame": {
                    "from": "2021-08-18T13:15:00+00:00",
                    "to": "2021-08-18T13:30:00+00:00"
                  },
                  "isDelayed": false,
                  "signatureRequired": false,
                  "photoRequired": false,
                  "estimates": {
                    "drivingTime": 6100,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "taskTime": 420,
                    "completionTime": "2021-08-18T20:11:35+00:00",
                    "arrivalTime": "2021-08-18T20:04:35+00:00",
                    "distance": 166810
                  },
                  "initialEstimates": {
                    "drivingTime": 0,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "taskTime": 420,
                    "completionTime": "2021-08-18T16:51:23+00:00",
                    "arrivalTime": "2021-08-18T16:44:23+00:00"
                  },
                  "pickups": [
                    {
                      "orderId": "c5320c8f-eb5f-a4ca-98d8-a0f454814bd3",
                      "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                      "orderSlug": "547778534",
                      "consignee": {
                        "companyName": "IKEA",
                        "legacyId": "11425",
                        "contactEmail": "ikea@mover.dk",
                        "contactPhone": {
                          "countryCallingCode": "45",
                          "nationalNumber": "52332355",
                          "countryPrefix": "45",
                          "number": "52332355"
                        }
                      },
                      "colli": []
                    }
                  ],
                  "deliveries": [],
                  "gate": "12",
                  "arrivedTime": "2021-05-21T13:31:32+00:00",
                  "taskTimeStarted": "2021-08-18T16:33:27+00:00",
                  "completedTime": "2021-05-21T13:31:38+00:00",
                  "port": "12"
                },
                {
                  "hidden": false,
                  "id": "1422018",
                  "driverInstructions": "Collection point",
                  "tags": [
                    "IntegrationV2",
                    "CC",
                    "ClickAndCollect",
                    "1man",
                    "Curbside",
                    "CollectionPoint",
                    "SGR60000851",
                    "Outbound",
                    "L068",
                    "CC4800",
                    "Mainland",
                    "1189084176"
                  ],
                  "status": "Arrived",
                  "type": "Delivery",
                  "collectionPointId": "670382f8-27c3-400b-acf2-c540ea98a77e",
                  "actions": {
                    "instructionsAccept": false,
                    "signature": false,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "handleAllColli": false,
                    "scanColli": false,
                    "photo": false,
                    "identity": false,
                    "verificationCode": false
                  },
                  "deviations": [],
                  "selfies": [],
                  "orderIds": [],
                  "outfit": {
                    "legacyId": "11425",
                    "contactPhone": {
                      "countryCode": "DK",
                      "countryCallingCode": "45",
                      "nationalNumber": "11223344",
                      "countryPrefix": "DK",
                      "number": "11223344"
                    }
                  },
                  "location": {
                    "address": { "primary": "Enighedsvej 46, 4800 Nykøbing Falster, DK" },
                    "position": { "latitude": 54.7599963, "longitude": 11.884732 },
                    "timeZone": "Europe/Copenhagen"
                  },
                  "arrivalTimeFrame": {
                    "from": "2021-08-18T18:00:00+00:00",
                    "to": "2021-08-18T19:00:00+00:00"
                  },
                  "isDelayed": false,
                  "signatureRequired": false,
                  "photoRequired": false,
                  "estimates": {
                    "drivingTime": 5072,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "taskTime": 420,
                    "completionTime": "2021-08-18T18:22:55+00:00",
                    "arrivalTime": "2021-08-18T18:15:55+00:00",
                    "distance": 117729
                  },
                  "initialEstimates": {
                    "drivingTime": 5072,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "taskTime": 420,
                    "completionTime": "2021-08-18T18:22:55+00:00",
                    "arrivalTime": "2021-08-18T18:15:55+00:00",
                    "distance": 117729
                  },
                  "pickups": [],
                  "deliveries": [
                    {
                      "orderId": "ce3f0846-adff-45b3-bc20-cb60c4462bec",
                      "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                      "consignee": {
                        "companyName": "IKEA",
                        "legacyId": "11425",
                        "contactEmail": "ikea@mover.dk",
                        "contactPhone": {
                          "countryCallingCode": "45",
                          "nationalNumber": "52332355",
                          "countryPrefix": "45",
                          "number": "52332355"
                        }
                      },
                      "colli": []
                    }
                  ],
                  "arrivedTime": "2021-05-21T13:31:45+00:00",
                  "taskTimeStarted": "2021-08-18T16:33:38+00:00"
                },
                {
                  "hidden": false,
                  "id": "1422019",
                  "driverInstructions": "Collection point",
                  "tags": [
                    "IntegrationV2",
                    "CC",
                    "ClickAndCollect",
                    "1man",
                    "Curbside",
                    "CollectionPoint",
                    "SGR60000851",
                    "Outbound",
                    "L068",
                    "CC3080",
                    "Mainland",
                    "1191559320"
                  ],
                  "status": "NotVisited",
                  "type": "Delivery",
                  "collectionPointId": "7bc16729-64b6-4d8d-bbe5-b79a678e2523",
                  "actions": {
                    "instructionsAccept": false,
                    "signature": false,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "handleAllColli": false,
                    "scanColli": false,
                    "photo": false,
                    "identity": false,
                    "verificationCode": false
                  },
                  "deviations": [],
                  "selfies": [],
                  "orderIds": [],
                  "outfit": {
                    "legacyId": "11425",
                    "contactPhone": {
                      "countryCode": "DK",
                      "countryCallingCode": "45",
                      "nationalNumber": "11223344",
                      "countryPrefix": "DK",
                      "number": "11223344"
                    }
                  },
                  "location": {
                    "address": { "primary": "Fredensborgvej 10, 3080 Tikøb, DK" },
                    "position": { "latitude": 56.0186427, "longitude": 12.4505666 },
                    "timeZone": "Europe/Copenhagen"
                  },
                  "arrivalTimeFrame": {
                    "from": "2021-08-18T10:00:00+00:00",
                    "to": "2021-08-18T11:00:00+00:00"
                  },
                  "isDelayed": true,
                  "signatureRequired": false,
                  "photoRequired": false,
                  "estimates": {
                    "drivingTime": 6100,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "taskTime": 420,
                    "completionTime": "2021-08-18T20:11:35+00:00",
                    "arrivalTime": "2021-08-18T20:04:35+00:00",
                    "distance": 166810
                  },
                  "initialEstimates": {
                    "drivingTime": 6100,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "taskTime": 420,
                    "completionTime": "2021-08-18T20:11:35+00:00",
                    "arrivalTime": "2021-08-18T20:04:35+00:00",
                    "distance": 166809
                  },
                  "pickups": [],
                  "deliveries": [
                    {
                      "orderId": "9fccfb1b-515f-4d43-91dd-e70d91d1d36b",
                      "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                      "consignee": {
                        "companyName": "IKEA",
                        "legacyId": "11425",
                        "contactEmail": "ikea@mover.dk",
                        "contactPhone": {
                          "countryCallingCode": "45",
                          "nationalNumber": "52332355",
                          "countryPrefix": "45",
                          "number": "52332355"
                        }
                      },
                      "colli": []
                    }
                  ]
                },
                {
                  "hidden": false,
                  "id": "1422020",
                  "driverInstructions": "Collection point",
                  "tags": [
                    "IntegrationV2",
                    "CC",
                    "ClickAndCollect",
                    "1man",
                    "Curbside",
                    "CollectionPoint",
                    "SGR60000851",
                    "Outbound",
                    "L068",
                    "CC3600",
                    "Mainland",
                    "1191499660"
                  ],
                  "status": "NotVisited",
                  "type": "Delivery",
                  "collectionPointId": "d6296d7a-56e6-46b7-ba13-cf8c71aa497e",
                  "actions": {
                    "instructionsAccept": false,
                    "signature": false,
                    "handoverVerification": false,
                    "colliCountVerification": false,
                    "timeFrameVerification": false,
                    "handleAllColli": false,
                    "scanColli": false,
                    "photo": false,
                    "identity": false,
                    "verificationCode": false
                  },
                  "deviations": [],
                  "selfies": [],
                  "orderIds": [],
                  "outfit": {
                    "legacyId": "11425",
                    "contactPhone": {
                      "countryCode": "DK",
                      "countryCallingCode": "45",
                      "nationalNumber": "11223344",
                      "countryPrefix": "DK",
                      "number": "11223344"
                    }
                  },
                  "location": {
                    "address": { "primary": "Havnegade 9, 3600 Frederikssund, DK" },
                    "position": { "latitude": 55.8379499, "longitude": 12.0572111 },
                    "timeZone": "Europe/Copenhagen"
                  },
                  "arrivalTimeFrame": {
                    "from": "2021-08-18T12:00:00+00:00",
                    "to": "2021-08-18T13:00:00+00:00"
                  },
                  "isDelayed": true,
                  "signatureRequired": false,
                  "photoRequired": false,
                  "estimates": {
                    "drivingTime": 2634,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "taskTime": 420,
                    "completionTime": "2021-08-18T21:02:29+00:00",
                    "arrivalTime": "2021-08-18T20:55:29+00:00",
                    "distance": 38970
                  },
                  "initialEstimates": {
                    "drivingTime": 2634,
                    "loadingTime": 420,
                    "waitingTime": 0,
                    "taskTime": 420,
                    "completionTime": "2021-08-18T21:02:29+00:00",
                    "arrivalTime": "2021-08-18T20:55:29+00:00",
                    "distance": 38970
                  },
                  "pickups": [],
                  "deliveries": [
                    {
                      "orderId": "1d6ffc3e-1176-4105-967a-0d08cc521a17",
                      "consignorId": "5d6db3d4-7e69-4939-8014-d028a5eb47ff",
                      "consignee": {
                        "companyName": "IKEA",
                        "legacyId": "11425",
                        "contactEmail": "ikea@mover.dk",
                        "contactPhone": {
                          "countryCallingCode": "45",
                          "nationalNumber": "52332355",
                          "countryPrefix": "45",
                          "number": "52332355"
                        }
                      },
                      "colli": []
                    }
                  ]
                }
              ],
              "createdDate": "2021-05-21T13:17:46+00:00"
            }
          ],
          "unscheduledShipments": [
            {
              "shipment": {
                "id": "1e4b5568-f100-49da-a59c-84566fda15bb",
                "pickup": {
                  "id": "1511554",
                  "arrivalTimeFrame": { "from": "2021-09-20T15:46:00+00:00" },
                  "location": {
                    "address": {
                      "primary": "Søtorvet 5, 1371 København K",
                      "secondary": "Regular"
                    },
                    "position": { "latitude": 55.683169, "longitude": 12.582815 },
                    "timeZone": "Europe/Copenhagen"
                  }
                },
                "delivery": {
                  "id": "1511555",
                  "location": {
                    "address": {
                      "primary": "Frederiksberg Allé 14, Denmark",
                      "secondary": "Regular"
                    },
                    "position": { "latitude": 55.673716, "longitude": 12.548118 },
                    "timeZone": "Europe/Copenhagen"
                  }
                }
              },
              "reasons": ["missing-problem-here"]
            },
            {
              "shipment": {
                "id": "1e4b5568-f100-49da-a59c-84566fda15bb",
                "pickup": {
                  "id": "1511554",
                  "arrivalTimeFrame": { "from": "2021-09-20T15:46:00+00:00" },
                  "location": {
                    "address": {
                      "primary": "Søtorvet 5, 1371 København K",
                      "secondary": "Regular"
                    },
                    "position": { "latitude": 55.683169, "longitude": 12.582815 },
                    "timeZone": "Europe/Copenhagen"
                  }
                },
                "delivery": {
                  "id": "1511556",
                  "location": {
                    "address": {
                      "primary": "Peter Bangs Vej 280, Frederiksberg, Denmark",
                      "secondary": "Regular"
                    },
                    "position": { "latitude": 55.678712, "longitude": 12.49899 },
                    "timeZone": "Europe/Copenhagen"
                  }
                }
              },
              "reasons": ["missing-problem-here"]
            }
          ]
        }
      }

    }
}
