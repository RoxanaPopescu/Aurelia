export default {
  "lastUpdate": "2018-06-19T14:00:00",
  "id": "120931",
  "slug": "R-9821-1-MV",
  "reference": "1230-232-1-MV",
  "status": "started",
  "expires": undefined,
  "vehicleTypeId": "165f348d-ea67-4c94-9b27-48f2be29d545",

  "stops": [
    {
      "id": "SI18211",
      "status": "completed",
      "outfit": {
        "id": "OI1283911",
        "companyName": "Rene Larsen",
        "contactPhone": {
          "countryCode": "DK",
          "number": "73125008",
          "formatted": "+45 73 12 50 08",
        }
      },
      "location": {
        "address": {
          "primary": "Søtorvet 5",
          "secondary": "1371 København K"
        },
        "position": {
          "latitude": 55.6853796,
          "longitude": 12.5626272
        }
      },
      "driverInstructions": "Please go talk to the contact person to pick up the last collo.",
      "loadingTime": "PT10M",
      "arrivalTimeFrame": {
        "from": "2018-06-19T12:00:00",
        "to": "2018-06-19T13:00:00"
      },
      "arrivalTime": "2018-06-19T12:35:00",
      "isDelayed": false,
      "signatureRequired": true,
      "signature": {
        "date": "2018-06-19T12:37:00",
        "imageUrl": "http://example.com/stops/597e24c2-d0c1-c02a-7a17-0a924ed5a249/signarure.png",
        "position": {
          "latitude": 55.6853796,
          "longitude": 12.5626272
        }
      },
      "photoRequired": true,
      "photo": {
        "date": "2018-06-19T12:37:00",
        "imageUrl": "http://example.com/stops/597e24c2-d0c1-c02a-7a17-0a924ed5a249/photo.png",
        "position": {
          "latitude": 55.6853796,
          "longitude": 12.5626272
        }
      },
      "pickups": [
        {
          "orderId": "order-id-1",
          "consignee": {
            "id": "OI1283912",
            "companyName": "Johanne Petersen",
            "contactPhone": {
              "countryCode": "DK",
              "number": "89891418",
              "formatted": "+45 89 89 14 18",
            }
          },
          "colli": [
            { "barcode": "4223849231", "status": "picked-up", "origin": "regular" },
            { "barcode": "4223849232", "status": "picked-up", "origin": "regular" },
            { "barcode": "4223849233", "status": "not-picked-up", "origin": "regular" },
            { "barcode": "4223849234", "status": "picked-up", "origin": "regular" }
          ]
        }
      ],
      "deliveries": [
      ],
    },

    {
      "hidden": true,
      "id": "SI18211.5-hidden",
      "status": "completed",
      "location": {
        "address": {
          "primary": "",
          "secondary": ""
        },
        "position": {
          "latitude": 55.7373796,
          "longitude": 12.4626272
        }
      }
    },

    {
      "id": "SI18212",
      "status": "not-visited",
      "outfit": {
        "id": "OI1283912",
        "companyName": "Annexgården A/S",
        "contactPhone": {
          "countryCode": "DK",
          "number": "32387240",
          "formatted": "+45 32 38 72 40",
        }
      },
      "location": {
        "address": {
          "primary": "Annexgårdsparken 2",
          "secondary": "3500 Værløse"
        },
        "position": {
          "latitude": 55.7849326,
          "longitude": 12.317074
        }
      },
      "loadingTime": "PT7M",
      "arrivalTimeFrame": {
        "from": "2018-06-19T13:00:00",
        "to": "2018-06-19T14:00:00"
      },
      "arrivalTime": "2018-06-19T13:52:00",
      "isDelayed": false,
      "signature": undefined,
      "photo": undefined,
      "pickups": [
        {
          "orderId": "order-id-2",
          "consignee": {
            "id": "OI1283913",
            "companyName": "Michael Gregersen",
            "contactPhone": {
              "countryCode": "DK",
              "number": "87345342",
              "formatted": "+45 33 33 33 33",
            }
          },
          "colli": [
            { "barcode": "4223849235", "status": "no-action", "origin": "regular" },
            { "barcode": "4223849236", "status": "no-action", "origin": "regular" },
            { "barcode": "4223849237", "status": "no-action", "origin": "regular" }
          ]
        },
        {
          "orderId": "order-id-3",
          "consignee": {
            "id": "OI1283914",
            "companyName": "Mahnu Ahner",
            "contactPhone": {
              "countryCode": "DK",
              "number": "53679038",
              "formatted": "+45 44 44 44 44",
            }
          },
          "colli": [
            { "barcode": "4223849238", "status": "no-action", "origin": "regular" }
          ]
        }
      ],
      "deliveries": [
        {
          "orderId": "order-id-1",
          "consignor": {
            "id": "OI1283911",
            "companyName": "Johannes Fog",
            "contactPhone": {
              "countryCode": "DK",
              "number": "83921290",
              "formatted": "+45 22 22 22 22",
            }
          },
          "colli": [
            { "barcode": "4223849231", "status": "picked-up", "origin": "regular" },
            { "barcode": "4223849232", "status": "picked-up", "origin": "regular" },
            { "barcode": "4223849233", "status": "not-picked-up", "origin": "regular" },
            { "barcode": "4223849234", "status": "picked-up", "origin": "regular" }
          ]
        }
      ],
    },

    {
      "id": "SI18213",
      "status": "not-visited",
      "outfit": {
        "id": "OI1283913",
        "companyName": "Peter Hansen",
        "contactPhone": {
          "countryCode": "DK",
          "number": "61872311",
          "formatted": "+45 23 37 83 83",
        }
      },
      "location": {
        "address": {
          "primary": "Råbrovej 1",
          "secondary": "2765 Smørum"
        },
        "position": {
          "latitude": 55.7372782,
          "longitude": 12.2875588
        }
      },
      "loadingTime": "PT8M",
      "arrivalTimeFrame": {
        "from": "2018-06-19T14:00:00",
        "to": "2018-06-19T15:00:00"
      },
      "arrivalTime": "2018-06-19T15:13:00",
      "isDelayed": false,
      "signature": undefined,
      "photo": undefined,
      "pickups": [
      ],
      "deliveries": [
        {
          "orderId": "order-id-2",
          "consignor": {
            "id": "OI1283912",
            "companyName": "Second Outfit",
            "contactPhone": {
              "countryCode": "DK",
              "number": "22 22 22 22",
              "formatted": "+45 22 22 22 22",
            }
          },
          "colli": [
            { "barcode": "4223849235", "status": "no-action", "origin": "regular" },
            { "barcode": "4223849236", "status": "no-action", "origin": "regular" },
            { "barcode": "4223849237", "status": "no-action", "origin": "regular" },
            { "barcode": "4223849238", "status": "no-action", "origin": "regular" }
          ]
        }
      ],
    },

    {
      "id": "SI18214",
      "status": "not-visited",
      "outfit": {
        "id": "OI1283914",
        "companyName": "Delight Design",
        "contactPerson": "Susanne H.",
        "contactPhone": {
          "countryCode": "DK",
          "number": "89213718",
          "formatted": "+45 44 44 44 44",
        }
      },
      "location": {
        "address": {
          "primary": "Hovedgaden 12",
          "secondary": "4000 Roskilde"
        },
        "position": {
          "latitude": 55.734815,
          "longitude": 12.1493503
        }
      },
      "loadingTime": "PT6M",
      "arrivalTimeFrame": {
        "from": "2018-06-19T14:00:00",
        "to": "2018-06-19T16:00:00"
      },
      "arrivalTime": "2018-06-19T15:46:00",
      "isDelayed": false,
      "signature": undefined,
      "photo": undefined,
      "pickups": [
      ],
      "deliveries": [
        {
          "orderId": "order-id-3",
          "consignor": {
            "id": "OI1283912",
            "companyName": "Second Outfit",
            "contactPhone": {
              "countryCode": "DK",
              "number": "23913819",
              "formatted": "+45 22 22 22 22",
            }
          },
          "colli": [
            { "barcode": "4223849238", "status": "no-action", "origin": "regular" }
          ]
        }
      ],
    }

  ],

  "fulfiller": {
    "id": "573f5f57-a580-4c40-99b0-8fbeb396ebe9",
    "companyName": "Mover",
    "contactName": "Support",
    "contactPhone": {
      "countryCode": "DK",
      "number": "23 55 22 33",
      "formatted": "+45 23 55 22 33",
    }
  },
  "driver": {
    "id": "driver-id-1",
    "name": { "first": "Yilmaz", "last": "Bulut" },
    "phone": { "formatted": "91988743" },
    "pictureUrl": "https://cdn1.thehunt.com/assets/default_avatar-51c8ddf72a3f138adf9443a3be871aa4.png"
  },
  "driverVehicle": {
    "id": "1bc49117-ddec-0038-fc9b-56c8ef996b1f",
    "licensePlate": "CW 55 798",
    "vehicleTypeId": "165f348d-ea67-4c94-9b27-48f2be29d545",
    "make": "Peugeout",
    "model": "Boxer",
    "color": "Hvis",
    "status": "approved"
  },
  "driverOnline": true,
  "driverPosition": {
    "latitude": 55.7683252,
    "longitude": 12.3263538
  },
  "plannedTimeFrame": {
    "from": "2018-06-19T12:30:00",
    "to": "2018-06-19T14:30:00"
  },
  "completionTime": "2018-06-19T15:48:00",
  "priceOverview": {
    "priceWithoutVat": 872,
    "vat": 218,
    "currencyCode": "DKK"
  },
  "driverListUrl": "https://www.mover.dk/pdf/customers/trip-overview/?sessionId=187426&token=42378DBA",
  "overallRating":  3,
  "allowAssignment": true
};
