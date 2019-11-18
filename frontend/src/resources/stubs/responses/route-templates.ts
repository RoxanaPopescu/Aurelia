const routeTemplate =
{
    id: "route-template-1-id",
    reference: "route-template-1-ref",
    consignor:
    {
        type: "Consignor",
        id: "93cb2b5f-f818-4db1-87e1-6b1bf1263e67",
        publicId: "Acme",
        companyName: "Acme Consignor",
        contactPerson: "Bugs Bunny",
        contactEmail: "contact@acme.cartoons",
        address: "Lysbovej 6, 4800 Nykøbing Falster",
        contactPhone: { number: "12345678" }
    },
    price: { amount: 1000, currencyCode: "DKK" },
    routeCreationTime: 7, // TODO: This should ideally not be days...
    startDateTime: "2019-10-21T00:00+02:00",
    endDateTime: "2019-11-01T00:00+02:00",
    instructions: "Lorem ipsum dolor sit amet",
    recurrence:
    [
        { enabled: true, driver: { id: "driver-1"} },
        { enabled: true, driver: { id: "driver-1"} },
        { enabled: true, driver: { id: "driver-1"} },
        { enabled: true, status: "requested" },
        { enabled: true, status: "requested" },
        { enabled: false },
        { enabled: false }
    ],
    stops:
    [
        {
            location: { address: { primary: "Foo Street 123, Foo City" } },
            type: "pickup",
            consignee: { companyName: "Foo Company", contactPhone: { countryPrefix: "45", number: "11111111" } },
            requirements:
            {
                photo: true,
                signature: false,
                scanColli: false,
                verifyTimeframe: false,
                customerCode: false,
                acceptInstructions: false
            },
            port: 42,
            arrivalTime: 12 * 3600,
            departureTime: 12.25 * 3600
        },
        {
            location: { address: { primary: "Bar Street 456, Bar City" } },
            type: "delivery",
            consignee: { companyName: "Bar Company", contactPhone: { countryPrefix: "45", number: "22222222" } },
            requirements:
            {
                photo: false,
                signature: false,
                scanColli: false,
                verifyTimeframe: false,
                customerCode: false,
                acceptInstructions: false
            },
            port: undefined,
            arrivalTime: 13 * 3600,
            departureTime: 13.25 * 3600
        },
        {
            location: { address: { primary: "baz Street 456, baz City" } },
            type: "delivery",
            consignee: { companyName: "baz Company", contactPhone: { countryPrefix: "45", number: "33333333" } },
            requirements:
            {
                photo: false,
                signature: true,
                scanColli: false,
                verifyTimeframe: false,
                customerCode: false,
                acceptInstructions: false
            },
            port: undefined,
            arrivalTime: 14 * 3600,
            departureTime: 14.25 * 3600
        }
    ]
};

export default
{
    "POST /api/v1/route-templates/list":
    {
        delay: 1000,
        data:
        {
            templates: [routeTemplate],
            templateCount: 1
        }
    },

    "POST /api/v1/route-templates/details":
    {
        data: routeTemplate
    },

    "POST /api/v1/route-templates/create":
    {
        status: 204
    },

    "POST /api/v1/route-templates/update":
    {
        status: 204
    },

    "POST /api/v1/route-templates/delete":
    {
        status: 204
    }
};
