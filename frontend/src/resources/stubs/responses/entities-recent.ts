// tslint:disable
export default
{
    "GET /api/v2/recent":
    {
        body:
        [
            {
                id: "5c24b896-d73d-439d-b16b-0be2f6f905db",
                type: "user",
                slug: "user-1-slug",
                name: "User 1",
                starred: false,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "61158565-9c9f-4a9b-986c-d1a7d6437a92",
                type: "driver",
                slug: "driver-1-slug",
                name: "Driver 1",
                starred: false,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "7c084a42-1762-453e-8855-d8be12763a5c",
                type: "order",
                slug: "order-1-slug",
                name: "Order 1",
                starred: true,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "cf2111a4-6fe0-42d7-b3f1-d5086d405b33",
                type: "route",
                slug: "route-1-slug",
                name: "Route 1",
                starred: true,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "97aeb5a0-67ea-4956-8b79-33337b8df6ef",
                type: "route-plan",
                slug: "route-plan-1-slug",
                name: "Route plan 1",
                starred: true,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "4c29b428-9416-43a1-9218-e13f161224c4",
                type: "route-template",
                slug: "route-template-1-slug",
                name: "Route template 1",
                starred: false,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "ef577a81-c2ec-47f4-8893-56279897ec40",
                type: "rule-set",
                slug: "rule-set-1-slug",
                name: "Rule set 1",
                starred: false,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "d499c766-5440-4402-8df8-9c549bb2347f",
                type: "order-group",
                slug: "order-group-1-slug",
                name: "Order group 1",
                starred: false,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "b4863b3b-d29e-44c7-a9aa-f326204dc783",
                type: "distribution-center",
                slug: "distribution-center-1-slug",
                name: "Distribution center 1",
                starred: false,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "51c9022b-335a-43bb-b740-b4451bf01309",
                type: "vehicle",
                slug: "vehicle-1-slug",
                name: "Vehicle 1",
                starred: false,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            },
            {
                id: "9bc1f65b-3b00-405a-a804-77937a9a8676",
                type: "communication-trigger",
                slug: "communication-trigger-1-slug",
                name: "Communication trigger 1",
                starred: false,
                parent:
                {
                    id: "37dfbd7f-b4bc-4578-903f-05f12279f951",
                    type: "organization",
                    slug: "mover",
                    name: "Mover",
                    starred: false
                }
            }
        ]
    },

    "POST /api/v2/recent":
    {
        status: 204
    }
}
