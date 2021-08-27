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
    "POST /api/v2/organizations/create": (method: string, url: URL, options: IApiRequestOptions) =>
    {
      organizations.push(options.body as any);

      return { body: options.body };
    },

    "GET /api/v2/organizations":
    {
      body: organizations
    },

    "POST /api/v2/organizations/mover-organization-id/delete":
    {
      status: 201
    },

    "GET /api/v2/organizations/mover-organization-id/profile":
    {
      body:
      {
        name: "Mover"
      }
    },

    "POST /api/v2/organizations/mover-organization-id/profile/save":
    {
      status: 201
    },

    "POST /api/v2/organizations/mover-organization-id/invites/send":
    {
      body:
      {
        id: "invite-2-id",
        email: "johndoe@example.com",
        role: { id: "role-1-id", name: "Role 1" },
        team: { id: "team-1-id", name: "Team 1" }
      }
    },

    "POST /api/v2/organizations/mover-organization-id/invites/invite-1-id/resend":
    {
      status: 201
    },

    "GET /api/v2/organizations/mover-organization-id/invites":
    {
      body:
      [
        {
          id: "invite-1-id",
          email: "johndoe@example.com",
          role: { id: "role-1-id", name: "Role 1" },
          team: { id: "team-1-id", name: "Team 1" }
        }
      ]
    },

    "POST /api/v2/organizations/mover-organization-id/invites/invite-1-id/revoke":
    {
      status: 201
    },

    "GET /api/v2/organizations/mover-organization-id/users":
    {
      body: Array(5).fill(
      {
        id: "user-1-id",
        fullName: "John Doe",
        preferredName: "John",
        email: "johndoe@example.com",
        phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        pictureUrl: "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4?s=200",
        role: { id: "role-1-id", name: "Role 1" },
        team: { id: "team-1-id", name: "Team 1" },
        lastOnline: DateTime.utc().toISO()
      })
    },

    "POST /api/v2/organizations/mover-organization-id/users/user-1-id/change-role":
    {
      status: 201
    },

    "POST /api/v2/organizations/mover-organization-id/users/user-1-id/remove":
    {
      status: 201
    },

    "GET /api/v2/organizations/mover-organization-id/roles":
    {
      body: Array(5).fill(
      {
        id: "role-1-id",
        name: "Role 1",
        createdDateTime: DateTime.utc().minus({ month: 1 }).toISO(),
        modifiedDateTime: DateTime.utc().minus({ week: 1 }).toISO(),
        permissions:
        [
          "view-orders",
          "view-order-details",
          "edit-orders",
          "edit-order-details",
          "view-routes",
          "view-route-details",
          "edit-routes",
          "edit-route-details",
          "view-route-plans",
          "edit-route-plans"
        ],
        userCount: 1
      })
    },

    "POST /api/v2/organizations/mover-organization-id/roles/create":
    {
      body:
      {
        id: "role-2-id",
        name: "Role 2",
        createdDateTime: DateTime.utc().toISO(),
        modifiedDateTime: DateTime.utc().toISO(),
        permissions:
        [
          "view-orders",
          "view-order-details",
          "edit-orders",
          "edit-order-details",
          "view-routes",
          "view-route-details",
          "edit-routes",
          "edit-route-details",
          "view-route-plans",
          "edit-route-plans"
        ],
        userCount: 0,
      }
    },

    "POST /api/v2/organizations/mover-organization-id/roles/role-1-id/save":
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
          "view-orders",
          "view-order-details",
          "edit-orders",
          "edit-order-details",
          "view-routes",
          "view-route-details",
          "edit-routes"
        ]
      }
    },

    "POST /api/v2/organizations/mover-organization-id/roles/role-1-id/duplicate":
    {
      body:
      {
        id: "role-3-id",
        name: "Role 1 [duplicate]",
        createdDateTime: DateTime.utc().toISO(),
        modifiedDateTime: DateTime.utc().toISO(),
        permissions:
        [
          "view-orders",
          "view-order-details",
          "edit-orders",
          "edit-order-details",
          "view-routes",
          "view-route-details",
          "edit-routes",
          "edit-route-details",
          "view-route-plans",
          "edit-route-plans"
        ],
        userCount: 0
      }
    },

    "POST /api/v2/organizations/mover-organization-id/roles/role-1-id/delete":
    {
      status: 201
    },

    "GET /api/v2/organizations/mover-organization-id/teams/team-1-id":
    {
      body:
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
    },

    "GET /api/v2/organizations/mover-organization-id/teams":
    {
      body: Array(5).fill(
      {
        id: "team-1-id",
        name: "Team 1",
        phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        address: { primary: "Foo Street 42", secondary: "1337 Denmark" },
        vatNumber: "42069",
        invoiceDirectly: true,
        invoiceEmail: "team1@example.com",
        userCount: 1
      })
    },

    "POST /api/v2/organizations/mover-organization-id/teams/create":
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
        userCount: 0
      }
    },

    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/save":
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

    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/delete":
    {
      status: 201
    },

    "GET /api/v2/organizations/mover-organization-id/teams/team-1-id/users":
    {
      body:
      [
        ...Array(5).fill(
        {
          id: "user-1-id",
          fullName: "John Doe",
          preferredName: "John",
          email: "johndoe@example.com",
          phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
          pictureUrl: "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4?s=200",
          role: { id: "role-1-id", name: "Role 1" },
          team: { id: "team-1-id", name: "Team 1" },
          lastOnline: DateTime.utc().toISO()
        })
      ]
    },

    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/add":
    {
      status: 201
    },

    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/user-1-id/remove":
    {
      status: 201
    },

    "GET /api/v2/organizations/mover-organization-id/permissions":
    {
      body:
      [
        { slug: "view-organization",   type: "view", group: "Organization", name: "View organization"  },
        { slug: "edit-organization",   type: "edit", group: "Organization", name: "Edit organization"  },

        { slug: "view-orders",         type: "view", group: "Orders",       name: "View orders"        },
        { slug: "view-order-details",  type: "view", group: "Orders",       name: "View order details" },
        { slug: "edit-orders",         type: "edit", group: "Orders",       name: "Edit orders"        },
        { slug: "edit-order-details",  type: "edit", group: "Orders",       name: "Edit order details" },

        { slug: "view-routes",         type: "view", group: "Routes",       name: "View routes"        },
        { slug: "view-route-details",  type: "view", group: "Routes",       name: "View route details" },
        { slug: "edit-routes",         type: "edit", group: "Routes",       name: "Edit routes"        },
        { slug: "edit-route-details",  type: "edit", group: "Routes",       name: "Edit route details" },

        { slug: "view-route-plans",    type: "view", group: "Route plans",  name: "View route plans"   },
        { slug: "edit-route-plans",    type: "edit", group: "Route plans",  name: "Edit route plans"   },

        { slug: "view-kpi",            type: "view", group: "KPI",          name: "View route plans"   },
        { slug: "edit-route-plans",    type: "edit", group: "KPI",          name: "Edit route plans"   }
      ]
    }
}
