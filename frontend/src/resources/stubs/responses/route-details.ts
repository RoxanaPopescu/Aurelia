// tslint:disable: max-file-line-count

const route =
{
    "id": "d7361480-34ae-4cb5-afcf-3dc54b5220a4",
    "slug": "R32234927583",
    "status": "accepted",
    "reference": "FRE-04E",
    "driverListUrl": "https://www.mover.dk/pdf/customers/trip-overview/?sessionId=384696&token=D9A02B1B",
    "vehicleTypeId": "2321cbd7-5bed-4035-a827-2bfea31bb8e8",
    "criticality": "medium",
    "driver":
    {
      "id": 302609,
      "name":
      {
        "first": "Fahad",
        "last": "Al-Nahar"
      },
      "phone":
      {
        "countryPrefix": "45",
        "number": "51325004",
        "formatted": "+45 51 32 50 04"
      },
      "pictureUrl": "https://cdn1.thehunt.com/assets/default_avatar-51c8ddf72a3f138adf9443a3be871aa4.png"
    },
    "driverOnline": true,
    "plannedTimeFrame":
    {
      "from": "2020-01-10T10:00:00+00:00",
      "to": "2020-01-10T16:00:00+00:00"
    },
    "completionTime": "2020-01-10T12:09:59+00:00",
    "fulfiller":
    {
      "type": "Fulfiller",
      "id": "2ab2712b-5f60-4439-80a9-a58379cce885",
      "publicId": "MoverLogistics",
      "companyName": "Mover Logistics",
      "contactPerson": "Operations",
      "contactEmail": "support@mover.dk",
      "address": "",
      "contactPhone":
      {
        "number": "",
        "countryPrefix": null
      }
    },
    "stops":
    [
      {
        "hidden": false,
        "id": "aaf058ed-fd56-4d21-a67c-ded397ad3777",
        "status": "not-visited",
        "type": "Pickup",
        "orderIds":
        [
          "S1844095",
          "S1849132",
          "S1849761",
          "S1850792"
        ],
        "outfit": {},
        "location":
        {
          "address":
          {
            "primary": "Vejle Landevej 29, 7000 Fredericia"
          },
          "position":
          {
            "latitude": 55.54448541,
            "longitude": 9.6810231
          }
        },
        "loadingTime": 1800,
        "arrivalTimeFrame":
        {
          "from": "2020-01-10T10:00:00+00:00",
          "to": "2020-01-10T10:00:00+00:00"
        },
        "arrivalTime": "2020-01-10T10:00:00+00:00",
        "completionTime": "2020-01-10T10:30:00+00:00",
        "isDelayed": false,
        "signatureRequired": false,
        "photoRequired": false,
        "estimates":
        {
          "drivingTime": 0,
          "loadingTime": 1800,
          "waitingTime": 0,
          "completionTime": "2020-01-10T10:30:00+00:00"
        },
        "pickups":
        [
          {
            "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
            "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
            "consignorOrderId": "S1850792",
            "consignee":
            {
              "companyName": "COOP (MAD)",
              "contactPhone":
              {
                "countryPrefix": "45",
                "number": "60439457",
                "formatted": "+45 60 43 94 57"
              }
            },
            "colli":
            [
              {
                "id": "7294013",
                "barcode": "00102280703",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "d37683e5-ef1b-49ea-b2d6-b8fca4eb3842",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294021",
                "barcode": "00102280717",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "2f4eecac-f4df-4243-ac0f-c41c0a89cb19",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294029",
                "barcode": "00102280796",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "bd23b784-50ad-43dc-b384-ae70e7e7d19c",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294035",
                "barcode": "00102280805",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "c89df5af-2c7f-4555-a294-a977951ddba8",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294041",
                "barcode": "00102280819",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "b2842cbd-e5fb-4d38-91d0-226269272ef0",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294045",
                "barcode": "00102280822",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "b084b811-f96c-4b99-8e5e-9ff60e57c369",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294049",
                "barcode": "00102280836",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "429e781f-5adb-4f99-886c-2f5538e7a8a2",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294053",
                "barcode": "00102280840",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "cf78ec19-ef93-41d2-b5db-4971669d17eb",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294055",
                "barcode": "00102280853",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "c79a5c7d-eb23-4abe-ae51-e697d5db1f63",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294057",
                "barcode": "00102280867",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "5168eba3-bb12-4b8d-bd24-602f50f360a2",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294059",
                "barcode": "00102280875",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "c59feb1f-cfdc-4d0a-86e7-05116567f0fd",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294061",
                "barcode": "00102280884",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "a973b937-64c9-479e-bad3-16aa432a6793",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294063",
                "barcode": "00102280898",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "e6eb5dbd-247a-44d7-a3f4-b000f142b078",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294065",
                "barcode": "00102280907",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "671af1d5-cb10-435c-a493-24b91826197d",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294067",
                "barcode": "00102280915",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "530acbb5-2bd5-4ead-878d-28f641e44217",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294069",
                "barcode": "00102280924",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "542f6a54-2a96-4087-a0e6-b5b4794420a8",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294071",
                "barcode": "00102280938",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "7409298e-141d-4157-a8cd-f7749d29e5de",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294073",
                "barcode": "00102280941",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "f14664d2-678d-41b6-81ff-417bd076553d",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294075",
                "barcode": "00102280955",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "06e70466-245c-4e90-be8f-f9937054d446",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294077",
                "barcode": "00102280969",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "ccc55719-eeb2-4c23-b4f8-f367f5e7076c",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294079",
                "barcode": "00102281037",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "aa00bff8-3132-4b40-ad2b-3c4c90a111bf",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294081",
                "barcode": "00102281045",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "44e22afe-97b5-40ef-8eb2-f3589d5a24bc",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294083",
                "barcode": "00102281054",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "29833197-64e4-4b69-8b05-64f35abfaa13",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294085",
                "barcode": "00102281068",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "9289fd36-f28c-4981-b41a-74779f5e2332",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294087",
                "barcode": "00102281071",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "90a2fbeb-c9fe-43f1-bb25-ddc82f9cb72c",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294089",
                "barcode": "00102281085",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "8b872f87-aa7d-4cff-8daa-10bb8661ce74",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              }
            ]
          },
          {
            "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
            "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
            "consignorOrderId": "S1844095",
            "consignee":
            {
              "companyName": "COOP (MAD)",
              "contactPhone":
              {
                "countryPrefix": "45",
                "number": "60439457",
                "formatted": "+45 60 43 94 57"
              }
            },
            "colli":
            [
              {
                "id": "7294001",
                "barcode": "00102277995",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "297f3fbe-32f4-4f22-aed5-519ffb43c93d",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294005",
                "barcode": "00102280685",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "ba0b1777-56b1-4cd3-9202-cbda14c7273b",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294011",
                "barcode": "00102280694",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "48e9b872-c2f3-470a-86dd-0580f1dc401a",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294019",
                "barcode": "00102281615",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "b04a8888-2a38-4d4d-afe7-553be6a0b63d",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294027",
                "barcode": "00102281978",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "c93f0d96-c6ed-4430-b094-0fd4e7fd396f",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294031",
                "barcode": "00102281981",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "5b8f9f94-2d10-4983-8199-e24ef83c340a",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294038",
                "barcode": "00102283863",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "d2ceb863-f53b-42d4-b8ea-ddc14fbccb3e",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              }
            ]
          },
          {
            "orderId": "de031f7d-033e-583e-bfca-3c981d6594d7",
            "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
            "consignorOrderId": "S1849761",
            "consignee":
            {
              "companyName": "COOP (MAD)",
              "contactPhone":
              {
                "countryPrefix": "45",
                "number": "60439457",
                "formatted": "+45 60 43 94 57"
              }
            },
            "colli":
            [
              {
                "id": "7294007",
                "barcode": "00102280677",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "de031f7d-033e-583e-bfca-3c981d6594d7",
                "colloId": "3496b118-6c6a-4c79-a8a1-48dff4192071",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849761"
              },
              {
                "id": "7294015",
                "barcode": "00102281607",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "de031f7d-033e-583e-bfca-3c981d6594d7",
                "colloId": "236718f2-ece8-48e4-8506-f0f5155dfd26",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849761"
              },
              {
                "id": "7294025",
                "barcode": "00102283850",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "de031f7d-033e-583e-bfca-3c981d6594d7",
                "colloId": "a17711a6-8485-40c8-be50-fa3e9733ab5b",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849761"
              }
            ]
          },
          {
            "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
            "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
            "consignorOrderId": "S1849132",
            "consignee":
            {
              "companyName": "COOP (MAD)",
              "contactPhone":
              {
                "countryPrefix": "45",
                "number": "60439457",
                "formatted": "+45 60 43 94 57"
              }
            },
            "colli":
            [
              {
                "id": "7294003",
                "barcode": "00102278007",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "25544c78-54a6-4903-99ee-175e9151d7c0",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294009",
                "barcode": "00102280663",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "ea0046b5-7ea8-47cf-8fb7-4ed6e94a9238",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294017",
                "barcode": "00102281553",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "79e08a71-3a03-46dd-a59f-03c7a60aab25",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294026",
                "barcode": "00102281567",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "6783dab0-8430-4aab-b21f-b3e8f4764e7e",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294033",
                "barcode": "00102281575",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "fba554e7-ddf6-4883-a0ba-390e26d61137",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294039",
                "barcode": "00102281584",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "d904036f-4aaa-4e64-bdcb-f020292b897c",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294043",
                "barcode": "00102281598",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "c6c3fe9f-25be-46f7-bf4f-81974a444231",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294047",
                "barcode": "00102281995",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "e47538cd-5644-4701-bed3-d8d847cae7de",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294051",
                "barcode": "00102283846",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "26285d9f-0656-4b8d-938c-dce08df1c183",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              }
            ]
          }
        ],
        "deliveries": [],
        "port": "1"
      },
      {
        "hidden": false,
        "id": "97c6fada-ad71-49de-8853-34d9b333bc52",
        "status": "not-visited",
        "type": "Delivery",
        "orderIds":
        [
          "S1850792"
        ],
        "outfit":
        {
          "companyName": "Rajinder Pal Singh",
          "contactPerson": "Rajinder Pal Singh",
          "contactPhone":
          {
            "countryPrefix": "45",
            "number": "60212550",
            "formatted": "+45 60 21 25 50"
          }
        },
        "location":
        {
          "address":
          {
            "primary": "Frejasvej 9, 6000 Kolding"
          },
          "position":
          {
            "latitude": 55.50686,
            "longitude": 9.51021191
          }
        },
        "loadingTime": 840,
        "arrivalTimeFrame":
        {
          "from": "2020-01-10T06:00:00+00:00",
          "to": "2020-01-10T16:00:00+00:00"
        },
        "arrivalTime": "2020-01-10T10:46:08+00:00",
        "completionTime": "2020-01-10T11:00:08+00:00",
        "isDelayed": false,
        "signatureRequired": false,
        "photoRequired": false,
        "estimates":
        {
          "drivingTime": 968,
          "loadingTime": 840,
          "waitingTime": 0,
          "completionTime": "2020-01-10T11:00:08+00:00"
        },
        "pickups": [],
        "deliveries":
        [
          {
            "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
            "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
            "consignorOrderId": "S1850792",
            "consignee":
            {
              "companyName": "COOP (MAD)",
              "contactPhone":
              {
                "countryPrefix": "45",
                "number": "60439457",
                "formatted": "+45 60 43 94 57"
              }
            },
            "colli":
            [
              {
                "id": "7294013",
                "barcode": "00102280703",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "d37683e5-ef1b-49ea-b2d6-b8fca4eb3842",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294021",
                "barcode": "00102280717",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "2f4eecac-f4df-4243-ac0f-c41c0a89cb19",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294029",
                "barcode": "00102280796",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "bd23b784-50ad-43dc-b384-ae70e7e7d19c",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294035",
                "barcode": "00102280805",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "c89df5af-2c7f-4555-a294-a977951ddba8",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294041",
                "barcode": "00102280819",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "b2842cbd-e5fb-4d38-91d0-226269272ef0",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294045",
                "barcode": "00102280822",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "b084b811-f96c-4b99-8e5e-9ff60e57c369",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294049",
                "barcode": "00102280836",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "429e781f-5adb-4f99-886c-2f5538e7a8a2",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294053",
                "barcode": "00102280840",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "cf78ec19-ef93-41d2-b5db-4971669d17eb",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294055",
                "barcode": "00102280853",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "c79a5c7d-eb23-4abe-ae51-e697d5db1f63",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294057",
                "barcode": "00102280867",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "5168eba3-bb12-4b8d-bd24-602f50f360a2",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294059",
                "barcode": "00102280875",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "c59feb1f-cfdc-4d0a-86e7-05116567f0fd",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294061",
                "barcode": "00102280884",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "a973b937-64c9-479e-bad3-16aa432a6793",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294063",
                "barcode": "00102280898",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "e6eb5dbd-247a-44d7-a3f4-b000f142b078",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294065",
                "barcode": "00102280907",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "671af1d5-cb10-435c-a493-24b91826197d",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294067",
                "barcode": "00102280915",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "530acbb5-2bd5-4ead-878d-28f641e44217",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294069",
                "barcode": "00102280924",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "542f6a54-2a96-4087-a0e6-b5b4794420a8",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294071",
                "barcode": "00102280938",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "7409298e-141d-4157-a8cd-f7749d29e5de",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294073",
                "barcode": "00102280941",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "f14664d2-678d-41b6-81ff-417bd076553d",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294075",
                "barcode": "00102280955",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "06e70466-245c-4e90-be8f-f9937054d446",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294077",
                "barcode": "00102280969",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "ccc55719-eeb2-4c23-b4f8-f367f5e7076c",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294079",
                "barcode": "00102281037",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "aa00bff8-3132-4b40-ad2b-3c4c90a111bf",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294081",
                "barcode": "00102281045",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "44e22afe-97b5-40ef-8eb2-f3589d5a24bc",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294083",
                "barcode": "00102281054",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "29833197-64e4-4b69-8b05-64f35abfaa13",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294085",
                "barcode": "00102281068",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "9289fd36-f28c-4981-b41a-74779f5e2332",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294087",
                "barcode": "00102281071",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "90a2fbeb-c9fe-43f1-bb25-ddc82f9cb72c",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              },
              {
                "id": "7294089",
                "barcode": "00102281085",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "a33f5b7d-bf5f-f9a6-c8da-faadecf23150",
                "colloId": "8b872f87-aa7d-4cff-8daa-10bb8661ce74",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1850792"
              }
            ]
          }
        ]
      },
      {
        "hidden": false,
        "id": "830f1075-85d1-49ae-9ea8-02c489b8ac5d",
        "status": "not-visited",
        "type": "Delivery",
        "orderIds":
        [
          "S1844095"
        ],
        "outfit":
        {
          "companyName": "Elsebeth Aavild Nielsen",
          "contactPerson": "Elsebeth Aavild Nielsen",
          "contactPhone":
          {
            "countryPrefix": "45",
            "number": "28938025",
            "formatted": "+45 28 93 80 25"
          }
        },
        "location":
        {
          "address":
          {
            "primary": "Brogårdshaven 96, 6000 Kolding"
          },
          "position":
          {
            "latitude": 55.50652905,
            "longitude": 9.43929306
          }
        },
        "loadingTime": 210,
        "arrivalTimeFrame":
        {
          "from": "2020-01-10T06:00:00+00:00",
          "to": "2020-01-10T16:00:00+00:00"
        },
        "arrivalTime": "2020-01-10T11:12:39+00:00",
        "completionTime": "2020-01-10T11:16:09+00:00",
        "isDelayed": false,
        "signatureRequired": false,
        "photoRequired": false,
        "estimates":
        {
          "drivingTime": 751,
          "loadingTime": 210,
          "waitingTime": 0,
          "completionTime": "2020-01-10T11:16:09+00:00"
        },
        "pickups": [],
        "deliveries":
        [
          {
            "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
            "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
            "consignorOrderId": "S1844095",
            "consignee":
            {
              "companyName": "COOP (MAD)",
              "contactPhone":
              {
                "countryPrefix": "45",
                "number": "60439457",
                "formatted": "+45 60 43 94 57"
              }
            },
            "colli":
            [
              {
                "id": "7294001",
                "barcode": "00102277995",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "297f3fbe-32f4-4f22-aed5-519ffb43c93d",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294005",
                "barcode": "00102280685",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "ba0b1777-56b1-4cd3-9202-cbda14c7273b",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294011",
                "barcode": "00102280694",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "48e9b872-c2f3-470a-86dd-0580f1dc401a",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294019",
                "barcode": "00102281615",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "b04a8888-2a38-4d4d-afe7-553be6a0b63d",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294027",
                "barcode": "00102281978",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "c93f0d96-c6ed-4430-b094-0fd4e7fd396f",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294031",
                "barcode": "00102281981",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "5b8f9f94-2d10-4983-8199-e24ef83c340a",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              },
              {
                "id": "7294038",
                "barcode": "00102283863",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "6bd4aba0-71ef-ead1-274d-dd7de3a9ce5f",
                "colloId": "d2ceb863-f53b-42d4-b8ea-ddc14fbccb3e",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1844095"
              }
            ]
          }
        ]
      },
      {
        "hidden": false,
        "id": "0fceebd6-6ee3-4f76-b3cd-0616097312cb",
        "status": "not-visited",
        "type": "Delivery",
        "orderIds":
        [
          "S1849761"
        ],
        "outfit":
        {
          "companyName": "Helle Søtrup",
          "contactPerson": "Helle Søtrup",
          "contactPhone":
          {
            "countryPrefix": "45",
            "number": "22277158",
            "formatted": "+45 22 27 71 58"
          }
        },
        "location":
        {
          "address":
          {
            "primary": "Hjelmsvej 11, 1. sal, 6000 Kolding"
          },
          "position":
          {
            "latitude": 55.48263121,
            "longitude": 9.47184276
          }
        },
        "loadingTime": 150,
        "arrivalTimeFrame":
        {
          "from": "2020-01-10T06:00:00+00:00",
          "to": "2020-01-10T16:00:00+00:00"
        },
        "arrivalTime": "2020-01-10T11:25:36+00:00",
        "completionTime": "2020-01-10T11:28:06+00:00",
        "isDelayed": false,
        "signatureRequired": false,
        "photoRequired": false,
        "estimates":
        {
          "drivingTime": 567,
          "loadingTime": 150,
          "waitingTime": 0,
          "completionTime": "2020-01-10T11:28:06+00:00"
        },
        "pickups": [],
        "deliveries":
        [
          {
            "orderId": "de031f7d-033e-583e-bfca-3c981d6594d7",
            "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
            "consignorOrderId": "S1849761",
            "consignee":
            {
              "companyName": "COOP (MAD)",
              "contactPhone":
              {
                "countryPrefix": "45",
                "number": "60439457",
                "formatted": "+45 60 43 94 57"
              }
            },
            "colli":
            [
              {
                "id": "7294007",
                "barcode": "00102280677",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "de031f7d-033e-583e-bfca-3c981d6594d7",
                "colloId": "3496b118-6c6a-4c79-a8a1-48dff4192071",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849761"
              },
              {
                "id": "7294015",
                "barcode": "00102281607",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "de031f7d-033e-583e-bfca-3c981d6594d7",
                "colloId": "236718f2-ece8-48e4-8506-f0f5155dfd26",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849761"
              },
              {
                "id": "7294025",
                "barcode": "00102283850",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "de031f7d-033e-583e-bfca-3c981d6594d7",
                "colloId": "a17711a6-8485-40c8-be50-fa3e9733ab5b",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849761"
              }
            ]
          }
        ]
      },
      {
        "hidden": false,
        "id": "e2be3412-841f-4d46-9d75-ef77c0c552b3",
        "status": "not-visited",
        "type": "Delivery",
        "orderIds":
        [
          "S1849132"
        ],
        "outfit":
        {
          "companyName": "Anneke Ruppel",
          "contactPerson": "Anneke Ruppel",
          "contactPhone":
          {
            "countryPrefix": "45",
            "number": "51253102",
            "formatted": "+45 51 25 31 02"
          }
        },
        "location":
        {
          "address":
          {
            "primary": "Klintevej 127, 6000 Kolding"
          },
          "position":
          {
            "latitude": 55.48189217,
            "longitude": 9.5010106
          }
        },
        "loadingTime": 300,
        "arrivalTimeFrame":
        {
          "from": "2020-01-10T12:00:00+00:00",
          "to": "2020-01-10T16:00:00+00:00"
        },
        "arrivalTime": "2020-01-10T11:34:55+00:00",
        "completionTime": "2020-01-10T11:39:55+00:00",
        "isDelayed": false,
        "signatureRequired": false,
        "photoRequired": false,
        "estimates":
        {
          "drivingTime": 409,
          "loadingTime": 300,
          "waitingTime": 1202,
          "completionTime": "2020-01-10T11:39:55+00:00"
        },
        "pickups": [],
        "deliveries":
        [
          {
            "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
            "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
            "consignorOrderId": "S1849132",
            "consignee":
            {
              "companyName": "COOP (MAD)",
              "contactPhone":
              {
                "countryPrefix": "45",
                "number": "60439457",
                "formatted": "+45 60 43 94 57"
              }
            },
            "colli":
            [
              {
                "id": "7294003",
                "barcode": "00102278007",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "25544c78-54a6-4903-99ee-175e9151d7c0",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294009",
                "barcode": "00102280663",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "ea0046b5-7ea8-47cf-8fb7-4ed6e94a9238",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294017",
                "barcode": "00102281553",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "79e08a71-3a03-46dd-a59f-03c7a60aab25",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294026",
                "barcode": "00102281567",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "6783dab0-8430-4aab-b21f-b3e8f4764e7e",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294033",
                "barcode": "00102281575",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "fba554e7-ddf6-4883-a0ba-390e26d61137",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294039",
                "barcode": "00102281584",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "d904036f-4aaa-4e64-bdcb-f020292b897c",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294043",
                "barcode": "00102281598",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "c6c3fe9f-25be-46f7-bf4f-81974a444231",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294047",
                "barcode": "00102281995",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "e47538cd-5644-4701-bed3-d8d847cae7de",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              },
              {
                "id": "7294051",
                "barcode": "00102283846",
                "status": "picked-up",
                "origin": "regular",
                "orderId": "5a61e747-e000-7284-a66f-1328041524aa",
                "colloId": "26285d9f-0656-4b8d-938c-dce08df1c183",
                "consignorId": "0f445c2d-2950-4b7c-bdbe-6f30bed493f9",
                "consignorOrderId": "S1849132"
              }
            ]
          }
        ]
      },
      {
        "hidden": false,
        "id": "adee244b-5848-4390-809c-b21f22e551ba",
        "status": "not-visited",
        "type": "Return",
        "orderIds":
        [
          null
        ],
        "outfit": {},
        "location":
        {
          "address":
          {
            "primary": "Vejle Landevej 29, 7000 Fredericia"
          },
          "position":
          {
            "latitude": 55.54448541,
            "longitude": 9.6810231
          }
        },
        "loadingTime": 300,
        "arrivalTimeFrame":
        {
          "from": "2020-01-10T01:00:00+00:00",
          "to": "2020-01-10T16:00:00+00:00"
        },
        "arrivalTime": "2020-01-10T12:04:59+00:00",
        "completionTime": "2020-01-10T12:09:59+00:00",
        "isDelayed": false,
        "signatureRequired": false,
        "photoRequired": false,
        "estimates":
        {
          "drivingTime": 1504,
          "loadingTime": 300,
          "waitingTime": 0,
          "completionTime": "2020-01-10T12:09:59+00:00"
        },
        "pickups": [],
        "deliveries": []
      }
    ],
    "totalWeightRange":
    {
      "from": 0,
      "to": 0
    },
    "allowAssignment": true
  };

export default
{
    "GET /api/v1/routes/details?routeSlug=R32234927583":
    {
        body: route
    }
};
