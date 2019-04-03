// tslint:disable
export default
{
  "GET /api/v1/routes/R0123456789":
  {
    data:
    {
      "id": "a81cb5de-4064-4256-9c45-2e0448bc8e83",
      "slug": "R0123456789",
      "status": "requested",
      "reference": "0910-36A-MV",
      "driverListUrl": "https://www.mover.systems/pdf/customers/trip-overview/?requestId=402855&token=CC07B330",
      "vehicleTypeId": "2321cbd7-5bed-4035-a827-2bfea31bb8e8",
      "criticality": "low",
      "driverOnline": false,
      "plannedTimeFrame": {
        "from": "2019-03-25T09:10:00+00:00",
        "to": "2019-03-25T09:10:00+00:00"
      },
      "completionTime": "2019-03-25T12:10:23+00:00",
      "fulfiller": {
        "type": "Fulfiller",
        "id": "8c46c031-a5c3-4a28-a2ec-a532aacca8ca",
        "publicId": "Coop_Mad_Sjaelland_transport",
        "companyName": "Coop Mad Sjælland Transport",
        "contactPerson": "",
        "contactEmail": "",
        "address": "",
        "contactPhone": {
          "number": "",
          "countryPrefix": null
        }
      },
      "stops": [
        {
          "hidden": false,
          "id": "e2219858-2a9c-4241-be46-6705d1d36094",
          "status": "not-visited",
          "type": "Pickup",
          "orderIds": [
            "SRO1000808_2019-02-11",
            "SRO1000816_2019-02-11",
            "SRO1000704_2019-02-11",
            "SRO1000703_2019-02-11",
            "SRO1000812_2019-02-11",
            "SRO1000841_2019-02-11",
            "SRO1001592_2019-02-11",
            "SRO1000766_2019-02-11",
            "SRO1001647_2019-02-11",
            "SRO1001139_2019-02-11",
            "SRO1001579_2019-02-11",
            "SRO1000050_2019-02-11",
            "SRO1000344_2019-02-11",
            "SRO1000699_2019-02-11",
            "SRO1000887_2019-02-11"
          ],
          "outfit": {},
          "location": {
            "address": {
              "primary": "Kirkebjerg Parkvej 39-37, 2605 Brøndbyvester"
            },
            "position": {
              "latitude": 55.6559673,
              "longitude": 12.3984849
            }
          },
          "loadingTime": 1800.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:10:00+00:00",
            "to": "2019-03-25T09:10:00+00:00"
          },
          "arrivalTime": "2019-03-25T09:10:00+00:00",
          "completionTime": "2019-03-25T09:40:00+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 0,
            "loadingTime": 1800,
            "waitingTime": 0,
            "completionTime": "2019-03-25T09:40:00+00:00"
          },
          "pickups": [
            {
              "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000808_2019-02-11",
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
                  "barcode": "MOV20195102050000689",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
                  "colloId": "7eea116e-ebc6-4a86-9119-8c2f11954270",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000808_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000688",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
                  "colloId": "143c8821-5273-417a-8487-fda15928b9a9",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000808_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000689",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
                  "colloId": "ba9b1df4-e406-45d4-a86c-ba4cb3ac8345",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000808_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000688",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
                  "colloId": "5983dac7-11bf-4c8e-807d-f4aded38689b",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000808_2019-02-11"
                }
              ]
            },
            {
              "orderId": "049541b2-88be-47ab-87bf-c3ca2f8d5535",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000816_2019-02-11",
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
                  "barcode": "MOV20196902050000707",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "049541b2-88be-47ab-87bf-c3ca2f8d5535",
                  "colloId": "16a115df-02ce-4001-84e0-c43025e0fbd4",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000816_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000707",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "049541b2-88be-47ab-87bf-c3ca2f8d5535",
                  "colloId": "61d7d70d-09d8-40be-a033-bbb10b633042",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000816_2019-02-11"
                }
              ]
            },
            {
              "orderId": "ad76abca-a12e-4216-914d-7463fca41ac7",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000703_2019-02-11",
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
                  "barcode": "MOV20196902050000511",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "ad76abca-a12e-4216-914d-7463fca41ac7",
                  "colloId": "b10ee4f0-b05e-4236-9f83-79a191e32427",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000703_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000511",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "ad76abca-a12e-4216-914d-7463fca41ac7",
                  "colloId": "d73fab11-0047-4fc9-b4ae-0b96c31bb3d6",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000703_2019-02-11"
                }
              ]
            },
            {
              "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000704_2019-02-11",
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
                  "barcode": "MOV20195102050000520",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
                  "colloId": "f20c511a-c11c-46f9-b5ee-4b274729ea06",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000704_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000519",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
                  "colloId": "974c757e-c7fd-4886-8539-e3070b4dd8f7",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000704_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000520",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
                  "colloId": "c8713fd5-247d-48e1-98e3-f42539b912be",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000704_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000519",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
                  "colloId": "a18b0749-324c-416c-b915-42fb796fe22b",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000704_2019-02-11"
                }
              ]
            },
            {
              "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000812_2019-02-11",
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
                  "barcode": "MOV20195102050000703",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
                  "colloId": "a4028479-945d-469a-a666-758aeeaa2dc9",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000812_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000704",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
                  "colloId": "8c7a4741-e9b1-4aa5-bab0-0b58282a3bde",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000812_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000704",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
                  "colloId": "14fa9e78-8d75-4847-8a56-22cdaaa43087",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000812_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000703",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
                  "colloId": "7adb6df2-8c67-4265-ac18-410237697efb",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000812_2019-02-11"
                }
              ]
            },
            {
              "orderId": "a062c6a6-1d1a-4ee5-a73b-8e447a6e6e4f",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1001592_2019-02-11",
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
                  "barcode": "MOV20196902050001711",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a062c6a6-1d1a-4ee5-a73b-8e447a6e6e4f",
                  "colloId": "40866b26-70f9-4c41-b370-182ae2b4d281",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001592_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050001711",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a062c6a6-1d1a-4ee5-a73b-8e447a6e6e4f",
                  "colloId": "7046d5da-b96c-4bda-9cb4-2c101b7f8e14",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001592_2019-02-11"
                }
              ]
            },
            {
              "orderId": "371ca1e9-adb6-48d9-8ad5-b3bfaff8fd76",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000841_2019-02-11",
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
                  "barcode": "MOV20195102050000723",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "371ca1e9-adb6-48d9-8ad5-b3bfaff8fd76",
                  "colloId": "0da562a9-2f82-4a40-9e06-b2dfe1367be3",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000841_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000723",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "371ca1e9-adb6-48d9-8ad5-b3bfaff8fd76",
                  "colloId": "6685db9a-5339-4fe5-9262-f9ab63a7d4a9",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000841_2019-02-11"
                }
              ]
            },
            {
              "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1001647_2019-02-11",
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
                  "barcode": "MOV20196902050001865",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
                  "colloId": "c0341aab-0676-4d2c-a2d3-a74a900fb97a",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001647_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050001864",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
                  "colloId": "0ed016c1-dd14-4ad2-ad5a-06395afb7d9f",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001647_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050001864",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
                  "colloId": "83e91ec9-ca57-4c7f-b97f-c0771d2d0c65",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001647_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050001865",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
                  "colloId": "cd9d58d7-3417-4bb3-8e6e-577e751bd1f0",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001647_2019-02-11"
                }
              ]
            },
            {
              "orderId": "6d74c0c9-7928-456f-96ca-81d84ce4cdba",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000766_2019-02-11",
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
                  "barcode": "MOV20196902050000640",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "6d74c0c9-7928-456f-96ca-81d84ce4cdba",
                  "colloId": "b273b4bd-bd96-41f4-9ab2-919fe02c2c9a",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000766_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000640",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "6d74c0c9-7928-456f-96ca-81d84ce4cdba",
                  "colloId": "bd7d122f-5d3d-4269-985f-296d9ace31a2",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000766_2019-02-11"
                }
              ]
            },
            {
              "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1001139_2019-02-11",
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
                  "barcode": "MOV20195102050000943",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "d12ad41a-49e8-4749-9f7f-a2c19d1daae8",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000945",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "ce5bfe88-e593-4f0c-805d-5e338ba6cea6",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000944",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "495a7dc5-f0d5-4468-9c03-0c7d72e8ad06",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000945",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "986af8f1-9497-4ebe-b897-9ac50a3fd178",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000943",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "93783fe0-1a5b-416f-aa56-7f781ee82a01",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000944",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "5a293e6e-66b4-445e-855e-b2cfd00d90e3",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                }
              ]
            },
            {
              "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1001579_2019-02-11",
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
                  "barcode": "MOV20195102050001694",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
                  "colloId": "ae2c0997-8123-4219-b4b7-3305761ab536",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001579_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050001694",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
                  "colloId": "5b65a195-6165-426a-9403-57c20f841187",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001579_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050001695",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
                  "colloId": "7cbadf03-7ee0-4535-8ea8-086b636ccc8d",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001579_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050001695",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
                  "colloId": "1125fefa-c58d-43d6-a880-2faa8ece73d8",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001579_2019-02-11"
                }
              ]
            },
            {
              "orderId": "3f249ff3-b473-4c9d-8c68-1f4bc627edea",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000344_2019-02-11",
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
                  "barcode": "MOV20196902050000333",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "3f249ff3-b473-4c9d-8c68-1f4bc627edea",
                  "colloId": "846fc7b6-1e40-4a48-bbeb-06fc52538497",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000344_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000333",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "3f249ff3-b473-4c9d-8c68-1f4bc627edea",
                  "colloId": "7eb1a50c-f0e5-4288-9315-74dbc8064fde",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000344_2019-02-11"
                }
              ]
            },
            {
              "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000050_2019-02-11",
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
                  "barcode": "MOV20196902050000032",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
                  "colloId": "aef5aec8-f350-4997-8599-68aeec81c615",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000050_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000033",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
                  "colloId": "42013cc8-8ef7-43f2-87c8-72c050d65483",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000050_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000033",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
                  "colloId": "80b32b17-19be-4bcb-a99a-142983deada3",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000050_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000032",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
                  "colloId": "80e88dcd-7462-4a92-9c44-3466763192ac",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000050_2019-02-11"
                }
              ]
            },
            {
              "orderId": "9d54633d-a7f8-4476-91f8-6179fa498a2e",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000699_2019-02-11",
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
                  "barcode": "MOV20196902050000505",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "9d54633d-a7f8-4476-91f8-6179fa498a2e",
                  "colloId": "b5461127-630c-4c99-96aa-4f2b55d575fc",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000699_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000505",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "9d54633d-a7f8-4476-91f8-6179fa498a2e",
                  "colloId": "06415065-ed79-4ded-a3f7-f803241ab34d",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000699_2019-02-11"
                }
              ]
            },
            {
              "orderId": "a630e67f-7c15-4e34-94ae-1e76411cac2b",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000887_2019-02-11",
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
                  "barcode": "MOV20196902050000764",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a630e67f-7c15-4e34-94ae-1e76411cac2b",
                  "colloId": "2f9764c6-979a-4b0e-8468-8d24b72c1525",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000887_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000764",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a630e67f-7c15-4e34-94ae-1e76411cac2b",
                  "colloId": "37a9fae9-0cd2-4daa-9e11-a70405a95854",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000887_2019-02-11"
                }
              ]
            }
          ],
          "deliveries": [],
          "port": ""
        },
        {
          "hidden": false,
          "id": "8921cd70-4807-49f1-866f-6f775565514e",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000808_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Securitas A/S",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Sydvestvej 98 , 2600  Glostrup"
            },
            "position": {
              "latitude": 55.661958,
              "longitude": 12.378316
            }
          },
          "loadingTime": 210.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T10:45:00+00:00"
          },
          "arrivalTime": "2019-03-25T09:46:32+00:00",
          "completionTime": "2019-03-25T09:50:02+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 392,
            "loadingTime": 210,
            "waitingTime": 0,
            "completionTime": "2019-03-25T09:50:02+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000808_2019-02-11",
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
                  "barcode": "MOV20195102050000689",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
                  "colloId": "7eea116e-ebc6-4a86-9119-8c2f11954270",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000808_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000688",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
                  "colloId": "143c8821-5273-417a-8487-fda15928b9a9",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000808_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000689",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
                  "colloId": "ba9b1df4-e406-45d4-a86c-ba4cb3ac8345",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000808_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000688",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "55d9eccd-cfe6-4ffe-a75a-c90c1fab786f",
                  "colloId": "5983dac7-11bf-4c8e-807d-f4aded38689b",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000808_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "349af3da-f475-4616-865b-083b529fa527",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000816_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Securitas Aftenhold",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Sydvestvej 98 , 2600  Glostrup"
            },
            "position": {
              "latitude": 55.661958,
              "longitude": 12.378316
            }
          },
          "loadingTime": 420.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T10:45:00+00:00"
          },
          "arrivalTime": "2019-03-25T09:50:02+00:00",
          "completionTime": "2019-03-25T09:57:02+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 0,
            "loadingTime": 420,
            "waitingTime": 0,
            "completionTime": "2019-03-25T09:57:02+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "049541b2-88be-47ab-87bf-c3ca2f8d5535",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000816_2019-02-11",
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
                  "barcode": "MOV20196902050000707",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "049541b2-88be-47ab-87bf-c3ca2f8d5535",
                  "colloId": "16a115df-02ce-4001-84e0-c43025e0fbd4",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000816_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000707",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "049541b2-88be-47ab-87bf-c3ca2f8d5535",
                  "colloId": "61d7d70d-09d8-40be-a033-bbb10b633042",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000816_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "53c22000-a549-47cd-bc7a-4ab60e69e1f6",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000703_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "VEKS AFTENHOLD",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Roskildevej 175 , 2620  Albertslund"
            },
            "position": {
              "latitude": 55.661275,
              "longitude": 12.341882
            }
          },
          "loadingTime": 210.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T10:30:00+00:00"
          },
          "arrivalTime": "2019-03-25T10:02:55+00:00",
          "completionTime": "2019-03-25T10:06:25+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 353,
            "loadingTime": 210,
            "waitingTime": 0,
            "completionTime": "2019-03-25T10:06:25+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "ad76abca-a12e-4216-914d-7463fca41ac7",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000703_2019-02-11",
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
                  "barcode": "MOV20196902050000511",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "ad76abca-a12e-4216-914d-7463fca41ac7",
                  "colloId": "b10ee4f0-b05e-4236-9f83-79a191e32427",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000703_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000511",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "ad76abca-a12e-4216-914d-7463fca41ac7",
                  "colloId": "d73fab11-0047-4fc9-b4ae-0b96c31bb3d6",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000703_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "0de7c9c2-7f91-440d-924c-b485e10ef6cd",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000704_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "VEKS",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Roskildevej 175 , 2620  Albertslund"
            },
            "position": {
              "latitude": 55.661275,
              "longitude": 12.341882
            }
          },
          "loadingTime": 420.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T10:30:00+00:00"
          },
          "arrivalTime": "2019-03-25T10:06:25+00:00",
          "completionTime": "2019-03-25T10:13:25+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 0,
            "loadingTime": 420,
            "waitingTime": 0,
            "completionTime": "2019-03-25T10:13:25+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000704_2019-02-11",
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
                  "barcode": "MOV20195102050000520",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
                  "colloId": "f20c511a-c11c-46f9-b5ee-4b274729ea06",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000704_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000519",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
                  "colloId": "974c757e-c7fd-4886-8539-e3070b4dd8f7",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000704_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000520",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
                  "colloId": "c8713fd5-247d-48e1-98e3-f42539b912be",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000704_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000519",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "5b770755-041c-4877-a1e6-8f34d0bb6686",
                  "colloId": "a18b0749-324c-416c-b915-42fb796fe22b",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000704_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "e3fb2805-4f94-4baa-8bdf-9fc80d8338b3",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000812_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Roskildevej 16 samlekonto",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Roskildevej 16 , 2620  Albertslund"
            },
            "position": {
              "latitude": 55.6641162,
              "longitude": 12.3634984
            }
          },
          "loadingTime": 300.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T10:45:00+00:00"
          },
          "arrivalTime": "2019-03-25T10:16:40+00:00",
          "completionTime": "2019-03-25T10:21:40+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 195,
            "loadingTime": 300,
            "waitingTime": 0,
            "completionTime": "2019-03-25T10:21:40+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000812_2019-02-11",
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
                  "barcode": "MOV20195102050000703",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
                  "colloId": "a4028479-945d-469a-a666-758aeeaa2dc9",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000812_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000704",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
                  "colloId": "8c7a4741-e9b1-4aa5-bab0-0b58282a3bde",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000812_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000704",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
                  "colloId": "14fa9e78-8d75-4847-8a56-22cdaaa43087",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000812_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000703",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "f3aa66f3-789c-402f-b7da-0a0d186e9af4",
                  "colloId": "7adb6df2-8c67-4265-ac18-410237697efb",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000812_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "619120b1-b932-4d89-ace8-a22d8f108d39",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1001592_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Roskildevej 16 samlekonto",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Roskildevej 16 , 2620  Albertslund"
            },
            "position": {
              "latitude": 55.6641162,
              "longitude": 12.3634984
            }
          },
          "loadingTime": 420.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T10:45:00+00:00"
          },
          "arrivalTime": "2019-03-25T10:21:40+00:00",
          "completionTime": "2019-03-25T10:28:40+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 0,
            "loadingTime": 420,
            "waitingTime": 0,
            "completionTime": "2019-03-25T10:28:40+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "a062c6a6-1d1a-4ee5-a73b-8e447a6e6e4f",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1001592_2019-02-11",
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
                  "barcode": "MOV20196902050001711",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a062c6a6-1d1a-4ee5-a73b-8e447a6e6e4f",
                  "colloId": "40866b26-70f9-4c41-b370-182ae2b4d281",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001592_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050001711",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a062c6a6-1d1a-4ee5-a73b-8e447a6e6e4f",
                  "colloId": "7046d5da-b96c-4bda-9cb4-2c101b7f8e14",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001592_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "0c153497-66c6-4083-abb3-30c04bb5b018",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000841_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Geberit A/S",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Roskildevej 16 , 2620  Albertslund"
            },
            "position": {
              "latitude": 55.6641162,
              "longitude": 12.3634984
            }
          },
          "loadingTime": 420.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T10:45:00+00:00"
          },
          "arrivalTime": "2019-03-25T10:28:40+00:00",
          "completionTime": "2019-03-25T10:35:40+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 0,
            "loadingTime": 420,
            "waitingTime": 0,
            "completionTime": "2019-03-25T10:35:40+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "371ca1e9-adb6-48d9-8ad5-b3bfaff8fd76",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000841_2019-02-11",
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
                  "barcode": "MOV20195102050000723",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "371ca1e9-adb6-48d9-8ad5-b3bfaff8fd76",
                  "colloId": "0da562a9-2f82-4a40-9e06-b2dfe1367be3",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000841_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000723",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "371ca1e9-adb6-48d9-8ad5-b3bfaff8fd76",
                  "colloId": "6685db9a-5339-4fe5-9262-f9ab63a7d4a9",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000841_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "0127c5a8-ddf0-414d-b72c-3e2a35743eb5",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1001647_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Unisport (lager Albertslund)",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Herstedvang 10-14 , 2620  Albertslund"
            },
            "position": {
              "latitude": 55.6688567,
              "longitude": 12.367206
            }
          },
          "loadingTime": 210.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T12:00:00+00:00"
          },
          "arrivalTime": "2019-03-25T10:39:04+00:00",
          "completionTime": "2019-03-25T10:42:34+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 204,
            "loadingTime": 210,
            "waitingTime": 0,
            "completionTime": "2019-03-25T10:42:34+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1001647_2019-02-11",
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
                  "barcode": "MOV20196902050001865",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
                  "colloId": "c0341aab-0676-4d2c-a2d3-a74a900fb97a",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001647_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050001864",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
                  "colloId": "0ed016c1-dd14-4ad2-ad5a-06395afb7d9f",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001647_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050001864",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
                  "colloId": "83e91ec9-ca57-4c7f-b97f-c0771d2d0c65",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001647_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050001865",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "81fe0f38-2681-49ba-a8f8-cf3693290bfa",
                  "colloId": "cd9d58d7-3417-4bb3-8e6e-577e751bd1f0",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001647_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "051e7a27-d31e-4bcc-a2bf-bb999ff33527",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000766_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Olivers Petfood",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Herstedvang 10 , 2620  Albertslund"
            },
            "position": {
              "latitude": 55.6688567,
              "longitude": 12.367206
            }
          },
          "loadingTime": 420.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T12:00:00+00:00"
          },
          "arrivalTime": "2019-03-25T10:42:34+00:00",
          "completionTime": "2019-03-25T10:49:34+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 0,
            "loadingTime": 420,
            "waitingTime": 0,
            "completionTime": "2019-03-25T10:49:34+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "6d74c0c9-7928-456f-96ca-81d84ce4cdba",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000766_2019-02-11",
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
                  "barcode": "MOV20196902050000640",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "6d74c0c9-7928-456f-96ca-81d84ce4cdba",
                  "colloId": "b273b4bd-bd96-41f4-9ab2-919fe02c2c9a",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000766_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000640",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "6d74c0c9-7928-456f-96ca-81d84ce4cdba",
                  "colloId": "bd7d122f-5d3d-4269-985f-296d9ace31a2",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000766_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "10abb372-c94a-4421-b5b1-46531b21f616",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1001139_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Brøndbyernes IF Fodbold (frokost)",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Brøndby Stadion 30 , 2605  Brøndby"
            },
            "position": {
              "latitude": 55.649055,
              "longitude": 12.417575
            }
          },
          "loadingTime": 210.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T23:59:00+00:00"
          },
          "arrivalTime": "2019-03-25T11:01:07+00:00",
          "completionTime": "2019-03-25T11:04:37+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 693,
            "loadingTime": 210,
            "waitingTime": 0,
            "completionTime": "2019-03-25T11:04:37+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1001139_2019-02-11",
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
                  "barcode": "MOV20195102050000943",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "d12ad41a-49e8-4749-9f7f-a2c19d1daae8",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000945",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "ce5bfe88-e593-4f0c-805d-5e338ba6cea6",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000944",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "495a7dc5-f0d5-4468-9c03-0c7d72e8ad06",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000945",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "986af8f1-9497-4ebe-b897-9ac50a3fd178",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000943",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "93783fe0-1a5b-416f-aa56-7f781ee82a01",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000944",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a9a6f312-71aa-411a-ae35-f3c4fb46e067",
                  "colloId": "5a293e6e-66b4-445e-855e-b2cfd00d90e3",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001139_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "0c54f473-48f2-401c-aec4-5d22b6e3b508",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1001579_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "- Amager Hospital Brøndbyøstervej ",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Brøndbyøstervej 160 , 2605  Brøndby"
            },
            "position": {
              "latitude": 55.6500749,
              "longitude": 12.4415746
            }
          },
          "loadingTime": 210.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T10:45:00+00:00"
          },
          "arrivalTime": "2019-03-25T11:13:24+00:00",
          "completionTime": "2019-03-25T11:16:54+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 527,
            "loadingTime": 210,
            "waitingTime": 0,
            "completionTime": "2019-03-25T11:16:54+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1001579_2019-02-11",
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
                  "barcode": "MOV20195102050001694",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
                  "colloId": "ae2c0997-8123-4219-b4b7-3305761ab536",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001579_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050001694",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
                  "colloId": "5b65a195-6165-426a-9403-57c20f841187",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001579_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050001695",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
                  "colloId": "7cbadf03-7ee0-4535-8ea8-086b636ccc8d",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001579_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050001695",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "cb5625ff-c027-47a0-8e0d-f19f5bae21cf",
                  "colloId": "1125fefa-c58d-43d6-a880-2faa8ece73d8",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1001579_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "e1c75d66-d231-49a8-9aa3-bdfca2bbcd83",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000344_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Bergsala extra",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Valseholmen 1 , 2650  Hvidovre"
            },
            "position": {
              "latitude": 55.611095,
              "longitude": 12.469374
            }
          },
          "loadingTime": 210.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T11:15:00+00:00"
          },
          "arrivalTime": "2019-03-25T11:31:48+00:00",
          "completionTime": "2019-03-25T11:35:18+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 894,
            "loadingTime": 210,
            "waitingTime": 0,
            "completionTime": "2019-03-25T11:35:18+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "3f249ff3-b473-4c9d-8c68-1f4bc627edea",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000344_2019-02-11",
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
                  "barcode": "MOV20196902050000333",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "3f249ff3-b473-4c9d-8c68-1f4bc627edea",
                  "colloId": "846fc7b6-1e40-4a48-bbeb-06fc52538497",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000344_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000333",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "3f249ff3-b473-4c9d-8c68-1f4bc627edea",
                  "colloId": "7eb1a50c-f0e5-4288-9315-74dbc8064fde",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000344_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "593e39a8-e22e-4ef3-ab0e-48d68e6d4ff8",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000050_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Enigma distribution A/S",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Valseholmen 1 , 2650  Hvidovre"
            },
            "position": {
              "latitude": 55.611095,
              "longitude": 12.469374
            }
          },
          "loadingTime": 420.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T11:15:00+00:00"
          },
          "arrivalTime": "2019-03-25T11:35:18+00:00",
          "completionTime": "2019-03-25T11:42:18+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 0,
            "loadingTime": 420,
            "waitingTime": 0,
            "completionTime": "2019-03-25T11:42:18+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000050_2019-02-11",
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
                  "barcode": "MOV20196902050000032",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
                  "colloId": "aef5aec8-f350-4997-8599-68aeec81c615",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000050_2019-02-11"
                },
                {
                  "barcode": "MOV20196902050000033",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
                  "colloId": "42013cc8-8ef7-43f2-87c8-72c050d65483",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000050_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000033",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
                  "colloId": "80b32b17-19be-4bcb-a99a-142983deada3",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000050_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000032",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "fbd61458-d4a2-4e73-8398-e373ee7a8dbe",
                  "colloId": "80e88dcd-7462-4a92-9c44-3466763192ac",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000050_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "ab2c21a3-be6d-4aa9-865a-07579436070c",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000699_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "Legrand Scandinavia",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Avedøreholme 48 , 2650  Hvidovre"
            },
            "position": {
              "latitude": 55.6137193,
              "longitude": 12.4679633
            }
          },
          "loadingTime": 120.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T11:15:00+00:00"
          },
          "arrivalTime": "2019-03-25T11:44:01+00:00",
          "completionTime": "2019-03-25T11:46:01+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 103,
            "loadingTime": 120,
            "waitingTime": 0,
            "completionTime": "2019-03-25T11:46:01+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "9d54633d-a7f8-4476-91f8-6179fa498a2e",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000699_2019-02-11",
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
                  "barcode": "MOV20196902050000505",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "9d54633d-a7f8-4476-91f8-6179fa498a2e",
                  "colloId": "b5461127-630c-4c99-96aa-4f2b55d575fc",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000699_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000505",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "9d54633d-a7f8-4476-91f8-6179fa498a2e",
                  "colloId": "06415065-ed79-4ded-a3f7-f803241ab34d",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000699_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "e1604348-9d69-4818-bf71-6a42d1ae4f14",
          "status": "not-visited",
          "type": "Delivery",
          "orderIds": [
            "SRO1000887_2019-02-11"
          ],
          "outfit": {
            "contactPerson": "DSC-Trading (Wrist Marine Logistics)",
            "contactPhone": {
              "countryPrefix": "45",
              "number": "53585845",
              "formatted": "+45 53 58 58 45"
            }
          },
          "location": {
            "address": {
              "primary": "Kanalholmen1 , 2650  Hvidovre"
            },
            "position": {
              "latitude": 55.612761,
              "longitude": 12.4552881
            }
          },
          "loadingTime": 120.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T09:00:00+00:00",
            "to": "2019-03-25T12:00:00+00:00"
          },
          "arrivalTime": "2019-03-25T11:48:35+00:00",
          "completionTime": "2019-03-25T11:50:35+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 154,
            "loadingTime": 120,
            "waitingTime": 0,
            "completionTime": "2019-03-25T11:50:35+00:00"
          },
          "pickups": [],
          "deliveries": [
            {
              "orderId": "a630e67f-7c15-4e34-94ae-1e76411cac2b",
              "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
              "consignorOrderId": "SRO1000887_2019-02-11",
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
                  "barcode": "MOV20196902050000764",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a630e67f-7c15-4e34-94ae-1e76411cac2b",
                  "colloId": "2f9764c6-979a-4b0e-8468-8d24b72c1525",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000887_2019-02-11"
                },
                {
                  "barcode": "MOV20195102050000764",
                  "status": "no-action",
                  "origin": "regular",
                  "orderId": "a630e67f-7c15-4e34-94ae-1e76411cac2b",
                  "colloId": "37a9fae9-0cd2-4daa-9e11-a70405a95854",
                  "consignorId": "b33ba768-e5c1-46d2-9c01-43b626600467",
                  "consignorOrderId": "SRO1000887_2019-02-11"
                }
              ]
            }
          ],
          "port": ""
        },
        {
          "hidden": false,
          "id": "04cf5f29-ffde-473f-9068-56e5a5fe7e0b",
          "status": "not-visited",
          "type": "Return",
          "orderIds": [],
          "outfit": {},
          "location": {
            "address": {
              "primary": "Kirkebjerg Parkvej 39-37, 2605 Brøndbyvester"
            },
            "position": {
              "latitude": 55.6559673,
              "longitude": 12.3984849
            }
          },
          "loadingTime": 300.0,
          "arrivalTimeFrame": {
            "from": "2019-03-25T01:00:00+00:00",
            "to": "2019-03-25T11:30:00+00:00"
          },
          "arrivalTime": "2019-03-25T12:05:23+00:00",
          "completionTime": "2019-03-25T12:10:23+00:00",
          "isDelayed": true,
          "signatureRequired": false,
          "photoRequired": false,
          "estimates": {
            "drivingTime": 888,
            "loadingTime": 300,
            "waitingTime": 0,
            "completionTime": "2019-03-25T12:10:23+00:00"
          },
          "pickups": [],
          "deliveries": [],
          "port": ""
        }
      ],
      "allowAssignment": false
    }
  }
};
