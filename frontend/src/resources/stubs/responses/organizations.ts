// tslint:disable
export default
{
    "POST /api/v1/organizations/create":
    {
      status: 201
    },

    "GET /api/v1/organizations":
    {
      body:
      [
        { name: "Mover", id: "mover-organization-id" },
        { name: "IKEA", id: "ikea-organization-id" },
        { name: "Coop", id: "coop-organization-id" }
      ]
    },

    "GET /api/v1/organizations/mover-organization-id":
    {
      body: { name: "Mover", id: "mover-organization-id" }
    },

    "GET /api/v1/organizations/ikea-organization-id":
    {
      body: { name: "IKEA", id: "ikea-organization-id" }
    },

    "GET /api/v1/organizations/coop-organization-id":
    {
      body: { name: "Coop", id: "coop-organization-id" }
    },

    "POST /api/v1/organizations/delete":
    {
      status: 201
    }
}
