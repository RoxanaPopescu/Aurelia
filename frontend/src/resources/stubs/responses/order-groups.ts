const orderGroup =
{
    id: "order-group-1-id",
    etag: "order-group-1-etag",
    name: "Order group 1",
    paused: false,
    timeZone: "Europe/Copenhagen",
    matchingCriteria:
    [
        {
            consignors:
            [
                {
                    id: "consignor-1-id",
                    slug: "consignor-1-slug",
                    companyName: "Consignor 1",
                    personName: null,
                    contactEmail: null,
                    address: null,
                    contactPhone: null
                }
            ],
            tags: ["tag-1", "tag-2", "tag-3"]
        }
    ],
    routePlanningTimes:
    [
        {
            delivery:
            {
                from: { dayOfWeek: 1, timeOfDay: "06:00" },
                to: { dayOfWeek: 5, timeOfDay: "22:00" }
            },
            planning: { dayOfWeek: 1, timeOfDay: "03:00" },
            nextPlanning: "2019-10-15T03:00+02:00"
        }
    ]
};

export default
{
    "POST /api/v1/ordergroups/tags":
    {
        data: ["tag-1", "tag-2", "tag-3", "tag-4", "tag-5", "tag-6"]
    },

    "POST /api/v1/ordergroups/list":
    {
        delay: 1000,
        data:
        {
            orderGroups: [orderGroup],
            orderGroupCount: 1
        }
    },

    "POST /api/v1/ordergroups/get":
    {
        data: orderGroup
    },

    "POST /api/v1/ordergroups/create":
    {
        data: orderGroup
    },

    "POST /api/v1/ordergroups/update":
    {
        data: orderGroup
    },

    "POST /api/v1/ordergroups/pause":
    {
        status: 201
    },

    "POST /api/v1/ordergroups/unpause":
    {
        status: 201
    }
};
