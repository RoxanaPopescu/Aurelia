import { DateTime } from "luxon";

const now = DateTime.utc();

const notification =
[
    {
        // Older than [1]
        id: "notification-0-id",
        createdDateTime: now.minus({ months: 1 }).toISO(),
        heading: "Notification 0",
        body: "Body of notification 0",
        details: undefined,
        url: undefined,
        seen: true
    },
    {
        // Older than [2]
        id: "notification-1-id",
        createdDateTime: now.minus({ weeks: 1 }).toISO(),
        heading: "Notification 1",
        body: "Body of notification 1",
        details: "Details of notification 1",
        url: "/organizations/momondo",
        seen: false
    },
    {
        // Older than [3]
        id: "notification-2-id",
        createdDateTime: now.minus({ days: 1 }).toISO(),
        heading: "Notification 2",
        body: "Body of notification 2",
        details: undefined,
        url: "/organizations/momondo/projects/web-app",
        seen: true
    },
    {
        // Older than [4]
        id: "notification-3-id",
        createdDateTime: now.minus({ hours: 1 }).toISO(),
        heading: "Notification 3",
        body: "Body of notification 3",
        details: undefined,
        url: "/organizations/momondo/projects/web-app",
        seen: false
    },
    {
        // Newest, at the time of the initial fetch
        id: "notification-4-id",
        createdDateTime: now.minus({ minutes: 1 }).toISO(),
        heading: "Notification 4",
        body: "Body of notification 4",
        details: undefined,
        url: "/organizations/momondo/projects/web-app",
        seen: false
    },

    {
        // Future, newer than [4]
        id: "notification-5-id",
        createdDateTime: now.plus({ minutes: 1 }).toISO(),
        heading: "Notification 5",
        body: "Body of notification 5",
        details: undefined,
        url: "/organizations/momondo/projects/web-app/locales/en-GB/?branch=master&source=/&strings=319309972",
        seen: false
    }
];

const endpoints = {};

// Start and polling:

// Called when the `notification-service` is started, fetching only the newest notification.
endpoints["GET /api/v2/notifications?limit=10"] =
{
    body:
    {
        unseenCount: 3,
        notifications:
        [
            notification[4]
        ]
    }
};

// Called on the first poll, fetching notifications newer than [4].
endpoints[`GET /api/v2/notifications?after=${notification[4].createdDateTime}&limit=300`] =
{
    body:
    {
        unseenCount: 4,
        notifications:
        [
            notification[5]
        ]
    }
};

// Called on the second poll, fetching notifications newer than [5].
endpoints[`GET /api/v2/notifications?after=${notification[5].createdDateTime}&limit=300`] =
{
    body:
    {
        unseenCount: 4,
        notifications:
        [
        ]
    }
};

// Open panel:

// Called when the `notifications` panel is opened, and no notifications have been fetched.
// This is only relevant if the `notification-service` hasn't been started, hasn't completed
// it's initial fetch, or no notifications existed at that time of the initial fetch.
endpoints["GET /api/v2/notifications?limit=300"] =
{
    body:
    {
        unseenCount: 3,
        notifications:
        [
            notification[4],
            notification[3],
            notification[2]
        ]
    }
};

// Called when the `notifications` panel is opened, triggering fetching of notifications older than [4].
endpoints[`GET /api/v2/notifications?before=${notification[4].createdDateTime}&limit=300`] =
{
    body:
    {
        unseenCount: 4, // or 3, if [5] is still in the future
        notifications:
        [
            notification[3],
            notification[2]
        ]
    }
};

// Scroll in panel:

// Called when the `notifications` panel is scrolled to the bottom, triggering fetching of notifications older than [2].
endpoints[`GET /api/v2/notifications?before=${notification[2].createdDateTime}&limit=300`] =
{
    body:
    {
        unseenCount: 4, // or 3, if [5] is still in the future
        notifications:
        [
            notification[1],
            notification[0]
        ]
    }
};

// Called when the `notifications` panel is scrolled to the bottom, triggering fetching of notifications older than [0].
endpoints[`GET /api/v2/notifications?before=${notification[0].createdDateTime}&limit=300`] =
{
    body:
    {
        unseenCount: 4, // or 3, if [5] is still in the future
        notifications:
        [
        ]
    }
};

endpoints["POST /api/v2/notifications/seen"] =
{
    status: 204
};

// tslint:disable
export default endpoints;
