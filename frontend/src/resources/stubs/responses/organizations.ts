import { IApiRequestOptions } from "shared/infrastructure";

const organizations =
[
  { name: "Mover", id: "mover-organization-id" },
  { name: "IKEA", id: "ikea-organization-id" },
  { name: "Coop", id: "coop-organization-id" }
];

// tslint:disable
export default
{
    "POST /api/v1/organizations/create": (method: string, url: URL, options: IApiRequestOptions) =>
    {
      organizations.push(options.body as any);

      return { status: 201 };
    },

    "GET /api/v1/organizations":
    {
      body: organizations
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
