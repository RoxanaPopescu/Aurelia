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
      status: 204
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
      status: 204
    },

    "POST /api/v2/organizations/mover-organization-id/invites/send":
    {
      body:
      {
        id: "invite-2-id",
        email: "james-doe@example.com",
        role: { id: "role-1-id", name: "Role 1" },
        teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }]
      }
    },

    "GET /api/v2/organizations/mover-organization-id/invites":
    {
      body:
      [
        {
          id: "invite-1-id",
          email: "jane-doe@example.com",
          role: { id: "role-1-id", name: "Role 1" },
          teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }]
        }
      ]
    },

    "GET /api/v2/invites/invite-1-id":
    {
      body:
      {
        id: "invite-1-id",
        email: "jane-doe@example.com",
        organization: { id: "mover-organization-id", name: "Mover"},
        role: { id: "role-1-id", name: "Role 1" },
        teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }]
      }
    },

    "POST /api/v2/invites/invite-1-id/resend":
    {
      status: 204
    },

    "POST /api/v2/invites/invite-1-id/accept":
    {
      status: 204
    },

    "POST /api/v2/invites/invite-1-id/revoke":
    {
      status: 204
    },

    "GET /api/v2/organizations/mover-organization-id/users":
    {
      body: getUsers(
        "user-1-id",
        "user-2-id",
        "user-3-id",
        "user-4-id",
        "user-5-id",
        "user-6-id"
      )
    },

    "POST /api/v2/organizations/mover-organization-id/users/user-1-id/change-role":
    {
      status: 204
    },

    "POST /api/v2/organizations/mover-organization-id/users/user-1-id/remove":
    {
      status: 204
    },

    "GET /api/v2/organizations/mover-organization-id/roles":
    {
      body: [1, 2, 3, 4, 5, 6].map(i =>
      ({
        id: `role-${i}-id`,
        name: `Role ${i}`,
        readonly: i > 3,
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
        userCount: i === 1 ? 1 : 0
      }))
    },

    "POST /api/v2/organizations/mover-organization-id/roles/create":
    {
      body:
      {
        id: "new-role-id",
        name: "New role",
        readonly: false,
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
        readonly: false,
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
        id: "role-1-duplicate-id",
        name: "Role 1 [duplicate]",
        readonly: false,
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
      status: 204
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
      body: [1, 2, 3, 4, 5, 6].map(i =>
      ({
        id: `team-${i}-id`,
        name: `Team ${i}`,
        phoneNumber: { countryCallingCode: "45", nationalNumber: "42424242" },
        address: { primary: "Foo Street 42", secondary: "1337 Denmark" },
        vatNumber: "42069",
        invoiceDirectly: true,
        invoiceEmail: `team-${i}@example.com`,
        userCount: 1
      }))
    },

    "POST /api/v2/organizations/mover-organization-id/teams/create":
    {
      body:
      {
        id: "new-team-id",
        name: "New team",
        phoneNumber: { countryCallingCode: "45", nationalNumber: "69696969" },
        address: { primary: "Bar Street 42", secondary: "1337 Denmark" },
        vatNumber: "69042",
        invoiceDirectly: true,
        invoiceEmail: "new-team@example.com",
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
        invoiceEmail: "team-1@example.com",
        userCount: 1
      }
    },

    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/delete":
    {
      status: 204
    },

    "GET /api/v2/organizations/mover-organization-id/teams/team-1-id/users":
    {
      body: getUsers(
        "user-1-id",
        "user-2-id",
        "user-3-id",
        "user-4-id"
      )
    },

    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/add":
    {
      status: 204
    },

    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/user-1-id/remove":
    {
      status: 204
    },
    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/user-2-id/remove":
    {
      status: 204
    },
    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/user-3-id/remove":
    {
      status: 204
    },
    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/user-4-id/remove":
    {
      status: 204
    },
    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/user-5-id/remove":
    {
      status: 204
    },
    "POST /api/v2/organizations/mover-organization-id/teams/team-1-id/users/user-6-id/remove":
    {
      status: 204
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

export function getUsers(...ids: string[]): any[]
{
  return [
    {
      id: "user-1-id",
      email: "john-doe@example.com",
      fullName: "John Doe",
      preferredName: "John",
      phoneNumber: { countryCode: "DK", countryCallingCode: "45", nationalNumber: "42424242" },
      pictureUrl: "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4?s=200",
      role: { id: "role-1-id", name: "Role 1" },
      teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }],
      lastOnline: DateTime.utc().toISO()
    },
    {
        id: "user-2-id",
        email: "jessica-richards@example.com",
        fullName: "Jessica Richards",
        preferredName: "Jessica",
        phoneNumber: { countryCode: "DK", countryCallingCode: "45", nationalNumber: "42424242" },
        pictureUrl: "https://randomuser.me/api/portraits/women/82.jpg",
        role: { id: "role-1-id", name: "Role 1" },
        teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }],
        lastOnline: DateTime.utc().toISO()
    },
    {
        id: "user-3-id",
        email: "annie-freeman@example.com",
        fullName: "Annie Freeman",
        preferredName: "Annie",
        phoneNumber: { countryCode: "DK", countryCallingCode: "45", nationalNumber: "42424242" },
        pictureUrl: "https://randomuser.me/api/portraits/women/63.jpg",
        role: { id: "role-1-id", name: "Role 1" },
        teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }],
        lastOnline: DateTime.utc().toISO()
    },
    {
        id: "user-4-id",
        email: "monica-bennett@example.com",
        fullName: "Monica Bennett",
        preferredName: "Monica",
        phoneNumber: { countryCode: "DK", countryCallingCode: "45", nationalNumber: "42424242" },
        pictureUrl: "https://randomuser.me/api/portraits/women/54.jpg",
        role: { id: "role-1-id", name: "Role 1" },
        teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }],
        lastOnline: DateTime.utc().toISO()
    },
    {
        id: "user-5-id",
        email: "mark-riley@example.com",
        fullName: "Mark Riley",
        preferredName: "Mark",
        phoneNumber: { countryCode: "DK", countryCallingCode: "45", nationalNumber: "42424242" },
        pictureUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        role: { id: "role-1-id", name: "Role 1" },
        teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }],
        lastOnline: DateTime.utc().toISO()
    },
    {
        id: "user-6-id",
        email: "andrew-wilson@example.com",
        fullName: "Andrew Wilson",
        preferredName: "Andrew",
        phoneNumber: { countryCode: "DK", countryCallingCode: "45", nationalNumber: "42424242" },
        pictureUrl: "https://randomuser.me/api/portraits/men/86.jpg",
        role: { id: "role-1-id", name: "Role 1" },
        teams: [{ id: "team-1-id", name: "Team 1" }, { id: "team-2-id", name: "Team 2" }],
        lastOnline: DateTime.utc().toISO()
    }
  ]
  .filter(u => ids.includes(u.id));
}

export function getUser(id: string): any
{
    return getUsers(id)[0];
}
