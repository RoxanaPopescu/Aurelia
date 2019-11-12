const routeTemplate =
{
    id: "route-template-1-id",
    reference: "route-template-ref",
    consignor:
    {
        id: "consignor-1-id",
        slug: "consignor-1-slug",
        companyName: "Consignor 1",
        personName: null,
        contactEmail: null,
        address: null,
        contactPhone: null
    },
    price: { amount: 100, currency: "DKK" },
    startDateTime: "2019-10-21T00:00+02:00",
    endDateTime: "2019-11-01T00:00+02:00",
    instructions: "Lorem ipsum dolor sit amet"
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
