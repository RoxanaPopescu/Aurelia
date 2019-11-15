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
            location: { address: { primary: "Some Street 123, Some City" } },
            type: "pickup",
            consignee: { companyName: "Some Company", contactPhone: { countryPrefix: "45", number: "12345678" } },
            requirements: ["foo", "bar"],
            port: 42,
            arrivalTime: 12 * 3600,
            departureTime: 12.25 * 3600
        },
        {
            location: { address: { primary: "Other Street 456, Other City" } },
            type: "delivery",
            consignee: { companyName: "Other Company", contactPhone: { countryPrefix: "45", number: "87654321" } },
            requirements: [],
            port: undefined,
            arrivalTime: 13 * 3600,
            departureTime: 13.25 * 3600
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
        data: routeTemplate
    },

    "POST /api/v1/route-templates/update":
    {
        data: routeTemplate
    }
};
