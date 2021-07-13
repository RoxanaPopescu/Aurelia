import { DateTime } from "luxon";
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

    "GET /api/v1/organizations/mover-organization-id/profile":
    {
      body:
      {
        name: "Mover"
      }
    },

    "POST /api/v1/organizations/mover-organization-id/profile/update":
    {
      status: 201
    },

    "GET /api/v1/organizations/mover-organization-id/users":
    {
      body:
      [
        {
          id: "user-1-id",
          fullName: "John Doe",
          preferredName: "John",
          email: "johndoe@example.com",
          phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
          role: { id: "role-1-id", name: "Role 1" },
          team: { id: "team-1-id", name: "Team 1" },
          status: "active",
          lastOnline: DateTime.utc().toISO()
        }
      ]
    },

    "POST /api/v1/organizations/mover-organization-id/users/invite":
    {
      body:
      {
        id: "user-2-id",
        fullName: "Jane Doe",
        preferredName: "Jane",
        email: "janedoe@example.com",
        phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        role: { id: "role-1-id", name: "Role 1" },
        team: { id: "team-1-id", name: "Team 1" },
        status: "invited",
        lastOnline: DateTime.utc().toISO()
      }
    },

    "POST /api/v1/organizations/mover-organization-id/users/user-2-id/reinvite":
    {
      status: 201
    },

    "POST /api/v1/organizations/mover-organization-id/users/user-1-id/remove":
    {
      status: 201
    },

    "GET /api/v1/organizations/mover-organization-id/roles":
    {
      body:
      [
        {
          id: "role-1-id",
          name: "Role 1",
          userCount: 1,
          createdDateTime: DateTime.utc().minus({ month: 1 }).toISO(),
          modifiedDateTime: DateTime.utc().minus({ week: 1 }).toISO(),
          permissions:
          [
            { id: "permission-1-id", name: "View orders", area: "Orders", type: "view" },
            { id: "permission-2-id", name: "View order details", area: "Orders", type: "view" },
            { id: "permission-3-id", name: "Edit orders", area: "Orders", type: "edit" },
            { id: "permission-4-id", name: "View routes", area: "Routes", type: "view" },
            { id: "permission-5-id", name: "View route details", area: "Routes", type: "view" },
            { id: "permission-6-id", name: "Edit routes", area: "Routes", type: "edit" }
          ]
        }
      ]
    },

    "POST /api/v1/organizations/mover-organization-id/roles/create":
    {
      body:
      {
        id: "role-2-id",
        name: "Role 2",
        userCount: 0,
        createdDateTime: DateTime.utc().toISO(),
        modifiedDateTime: DateTime.utc().toISO(),
        permissions:
        [
          { id: "permission-1-id", name: "View orders", area: "Orders", type: "view" },
          { id: "permission-2-id", name: "View order details", area: "Orders", type: "view" },
          { id: "permission-4-id", name: "View routes", area: "Routes", type: "view" },
          { id: "permission-5-id", name: "View route details", area: "Routes", type: "view" }
        ]
      }
    },

    "POST /api/v1/organizations/mover-organization-id/roles/role-1-id/update":
    {
      body:
      {
        id: "role-1-id",
        name: "Role 1 [updated]",
        userCount: 1,
        createdDateTime: DateTime.utc().minus({ month: 1 }).toISO(),
        modifiedDateTime: DateTime.utc().toISO(),
        permissions:
        [
          { id: "permission-1-id", name: "View orders", area: "Orders", type: "view" },
          { id: "permission-2-id", name: "View order details", area: "Orders", type: "view" },
          { id: "permission-3-id", name: "Edit orders", area: "Orders", type: "edit" }
        ]
      }
    },

    "POST /api/v1/organizations/mover-organization-id/roles/role-1-id/dublicate":
    {
      body:
      {
        id: "role-3-id",
        name: "Role 1 [dublicate]",
        userCount: 0,
        createdDateTime: DateTime.utc().toISO(),
        modifiedDateTime: DateTime.utc().toISO(),
        permissions:
        [
          { id: "permission-1-id", name: "View orders", area: "Orders", type: "view" },
          { id: "permission-2-id", name: "View order details", area: "Orders", type: "view" },
          { id: "permission-3-id", name: "Edit orders", area: "Orders", type: "edit" },
          { id: "permission-4-id", name: "View routes", area: "Routes", type: "view" },
          { id: "permission-5-id", name: "View route details", area: "Routes", type: "view" },
          { id: "permission-6-id", name: "Edit routes", area: "Routes", type: "edit" }
        ]
      }
    },

    "POST /api/v1/organizations/mover-organization-id/roles/role-1-id/delete":
    {
      status: 201
    },

    "GET /api/v1/organizations/mover-organization-id/teams":
    {
      body:
      [
        {
          id: "team-1-id",
          name: "Team 1",
          phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
          address: { primary: "Foo Street 42", secondary: "1337 Denmark" },
          vatNumber: "42069",
          invoiceDirectly: true,
          invoiceEmail: "team1@example.com",
          userCount: 1
        }
      ]
    },

    "POST /api/v1/organizations/mover-organization-id/teams/create":
    {
      body:
      {
        id: "team-2-id",
        name: "Team 2",
        phoneNumber: { countryCallingCode: "45", nationalNumber: "69696969" },
        address: { primary: "Bar Street 42", secondary: "1337 Denmark" },
        vatNumber: "69042",
        invoiceDirectly: true,
        invoiceEmail: "team2@example.com",
        userCount: 1
      }
    },

    "POST /api/v1/organizations/mover-organization-id/teams/team-1-id/update":
    {
      body:
      {
        id: "team-1-id",
        name: "Team 1 [updated]",
        phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        address: { primary: "Foo Street 42", secondary: "1337 Denmark" },
        vatNumber: "42069",
        invoiceDirectly: true,
        invoiceEmail: "team1@example.com",
        userCount: 1
      }
    },

    "POST /api/v1/organizations/mover-organization-id/teams/team-1-id/delete":
    {
      status: 201
    },

    "GET /api/v1/organizations/mover-organization-id/teams/team-1-id/users":
    {
      body:
      [
        {
          id: "user-1-id",
          fullName: "John Doe",
          preferredName: "John",
          email: "johndoe@example.com",
          phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
          role: { id: "role-1-id", name: "Role 1" },
          team: { id: "team-1-id", name: "Team 1" },
          status: "active",
          lastOnline: DateTime.utc().toISO()
        }
      ]
    },

    "POST /api/v1/organizations/mover-organization-id/teams/team-1-id/users/add":
    {
      status: 201
    },

    "POST /api/v1/organizations/mover-organization-id/teams/team-1-id/users/user-1-id/remove":
    {
      status: 201
    },

    "GET /api/v1/organizations/mover-organization-id/permissions":
    {
      body:
      [
        { id: "permission-1-id", name: "View orders", area: "Orders", type: "view" },
        { id: "permission-2-id", name: "View order details", area: "Orders", type: "view" },
        { id: "permission-3-id", name: "Edit orders", area: "Orders", type: "edit" },
        { id: "permission-4-id", name: "View routes", area: "Routes", type: "view" },
        { id: "permission-5-id", name: "View route details", area: "Routes", type: "view" },
        { id: "permission-6-id", name: "Edit routes", area: "Routes", type: "edit" }
      ]
    },

    "POST /api/v1/organizations/mover-organization-id/delete":
    {
      status: 201
    }
}
